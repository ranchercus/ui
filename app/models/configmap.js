import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { computed, get } from '@ember/object';
import { reference } from '@rancher/ember-api-store/utils/denormalize';
import Resource from '@rancher/ember-api-store/models/resource';

export default Resource.extend({
  router:       service(),
  clusterStore: service(),

  state:        'active',
  canClone:     true,

  namespace: reference('namespaceId', 'namespace', 'clusterStore'),

  firstKey:  alias('keys.firstObject'),

  workloads: computed('namespace.workloads.@each.volumes', 'namespace.workloads.@each.containers', function() {
    return (get(this, 'namespace.workloads') || []).filter((workload) => {
      const volume = (get(workload, 'volumes') || []).find((volume) => get(volume, 'configMap.name') === get(this, 'name'));
      const env = (get(workload, 'containers') || []).find((container) => (get(container, 'environmentFrom') || []).find((env) => get(env, 'source') === 'configMap' && get(env, 'sourceName') === get(this, 'name')));

      return volume || env;
    });
  }),

  keys:     computed('data', function() {
    return Object.keys(get(this, 'data') || {}).sort();
  }),

  actions: {
    edit() {
      get(this, 'router').transitionTo('authenticated.project.config-maps.detail.edit', get(this, 'id'));
    },

    clone() {
      get(this, 'router').transitionTo('authenticated.project.config-maps.new', get(this, 'projectId'), { queryParams: { id: get(this, 'id') } });
    }

  },

});
