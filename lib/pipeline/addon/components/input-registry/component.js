import Component from '@ember/component';
import { observer } from '@ember/object';
import { computed } from '@ember/object';
import layout from './template';
import { inject as service } from '@ember/service';
import { set, get } from '@ember/object';
import C from 'shared/utils/pipeline-constants';

export default Component.extend({
  scope: service(),
  store: service(),

  globalStore: service(),

  layout,

  // Inputs
  config:     null,
  registries: null,

  // Internal
  invalidRegistry: false,
  registryChoices: null,

  linkToRegistry: null,
  workloads:      [],
  loading:        false,
  storedWorkload: '',
  showRunCs:      false,

  init() {
    this._super(...arguments);

    this.initRegistries();
    set(this, 'linkToRegistry', `/p/${ get(this, 'scope.currentProject.id') }/registries/add`);

    set(this, 'loading', true);
    this.store.findAll('deployment').then((hash) => {
      set(this, 'workloads', hash);
    }).finally(() => {
      set(this, 'loading', false);
    });

    this.initNamespace();
    const workloadId = get(this, 'config.workloadId');

    set(this, 'storedWorkload', workloadId);
  },

  registriesDidChange: observer('registries.[]', function() {
    this.initRegistries();
  }),

  namespaceDidChange: observer('workloadsChoices', function() {
    const workloads = get(this, 'workloadsChoices') || [];
    const found = workloads.findBy('id', get(this, 'config.workloadId'));

    if ( !found ) {
      const ns = get(this, 'namespace.id');
      const workloadId = get(this, 'storedWorkload') || '';
      const wsplit = workloadId.split(':');

      if ( wsplit.length === 3 ) {
        if ( wsplit[1] !== ns ) {
          set(this, 'config.workloadId', null);
        } else {
          set(this, 'config.workloadId', workloadId);
        }
      }
    }
    set(this, 'config.targetNamespace', get(this, 'namespace.id') || get(this, 'namespace.name'));
  }),

  workloadsChoices: computed('namespace.id', 'workloads.[]', function() {
    const namespaceId = get(this, 'namespace.id');

    return (get(this, 'workloads') || []).filter((w) => get(w, 'namespaceId') === namespaceId).sortBy('displayName');
  }),

  initRegistries() {
    const out = [];

    get(this, 'registries').find((item) => {
      Object.keys(get(item, 'registries')).forEach((registry) => {
        if ( C.DEFAULT_REGISTRY === registry ) {
          out.unshift({
            label: 'Docker Hub',
            value: registry,
          });
        } else {
          out.push({
            label: registry,
            value: registry,
          });
        }
      });
    });
    set(this, 'registryChoices', out);
    if ( !get(this, 'config.registry') && out.length ) {
      set(this, 'config.registry', get(this, 'registryChoices.firstObject.value'));
    }
    const globalStore = get(this, 'globalStore');
    const project = window.l('route:application').modelFor('authenticated.project').get('project');
    const clusterId = project.get('clusterId');

    set(this, 'loading', true);
    let scriptItems = [{
      label: '',
      value: ''
    }];

    globalStore.find('clustersetting', clusterId).then((hash) => {
      if ( hash && hash.pipelineSetting && hash.pipelineSetting.callbackScripts ) {
        const callbackScripts = hash.pipelineSetting.callbackScripts || [];

        callbackScripts.forEach((item) => {
          scriptItems.push(item);
        });
        set(this, 'showRunCs', true);
      } else {
        set(this, 'showRunCs', false);
      }
    }).finally(() => {
      set(this, 'scriptsChoices', scriptItems);
      set(this, 'loading', false);
    });
  },

  initNamespace() {
    const namespaceId = get(this, 'config.targetNamespace');

    if ( namespaceId ) {
      set(this, 'namespace', { id: namespaceId });
    }
  },
});
