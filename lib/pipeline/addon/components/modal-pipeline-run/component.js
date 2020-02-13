import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import ModalBase from 'shared/mixins/modal-base';
import { inject as service } from '@ember/service';
import layout from './template';
import { get, set } from '@ember/object';
import { next } from '@ember/runloop';
import { observer } from '@ember/object';

export default Component.extend(ModalBase, {
  router: service(),

  globalStore: service(),

  layout,
  classNames: ['medium-modal', 'alert'],

  branch:          null,
  branchesChoices: null,
  errors:          [],
  loading:         false,
  hasMaster:       false,
  showRunCs:       false,
  showRunScan:     false,

  model: alias('modalService.modalOpts.originalModel'),

  init() {
    this._super(...arguments);

    set(this, 'loading', true);
    get(this, 'model').followLink('branches')
      .then((branches) => {
        if ( this.isDestroyed || this.isDestroying ) {
          return;
        }
        set(this, 'branchesChoices', JSON.parse(branches).map((b) => {
          if ( b === 'master' ) {
            set(this, 'hasMaster', true);
          }

          return {
            label: b,
            value: b
          };
        })
          .sortBy('label'));
        if ( get(this, 'branchesChoices.length') ) {
          next(() => {
            set(this, 'branch', get(this, 'branchesChoices.firstObject.value'));
            if ( get(this, 'hasMaster') ) {
              set(this, 'branch', 'master');
            }
          });
        } else {
          set(this, 'loading', false);
        }
      })
      .finally(() => {
        set(this, 'loading', false);
      });
    const globalStore = get(this, 'globalStore');
    const project = window.l('route:application').modelFor('authenticated.project').get('project');
    const clusterId = project.get('clusterId');

    set(this, 'loading', true);
    globalStore.find('clustersetting', clusterId).then((hash) => {
      if ( hash && hash.pipelineSetting && hash.pipelineSetting.callbackScripts ) {
        set(this, 'showRunCs', true);
      } else {
        set(this, 'showRunCs', false);
      }
      if ( hash && hash.pipelineSetting && hash.pipelineSetting.sonarScanner ) {
        set(this, 'showRunScan', true);
      } else {
        set(this, 'showRunScan', false);
      }
    }).catch(() => {
      set(this, 'showRunCs', false);
      set(this, 'showRunScan', false);
    }).finally(() => {
      set(this, 'loading', false);
    });
  },

  actions: {
    save(cb) {
      const branch = get(this, 'branch');
      const runCallbackScript = get(this, 'runCallbackScript');
      const runCodeScanner = get(this, 'runCodeScanner');

      get(this, 'model').doAction('run', {
        branch,
        runCallbackScript,
        runCodeScanner,
      })
        .then(() => {
          const pipelineId = get(this, 'model.id');
          const nextRun = get(this, 'model.nextRun');

          this.send('cancel');
          get(this, 'router').transitionTo('authenticated.project.pipeline.pipelines.run', pipelineId, nextRun);
        })
        .finally(() => {
          cb();
        });
    },
  },

  branchDidChange: observer('branch', function() {
    if ( get(this, 'showRunCs') ) {
      const branch = get(this, 'branch');

      if ( branch === 'master' ) {
        set(this, 'runCallbackScript', true);
      } else {
        set(this, 'runCallbackScript', false);
      }
    }
    if ( get(this, 'showRunScan') ) {
      const branch = get(this, 'branch');

      if ( branch === 'master' ) {
        set(this, 'runCodeScanner', true);
      } else {
        set(this, 'runCodeScanner', false);
      }
    }
  })
});
