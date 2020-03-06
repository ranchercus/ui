import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { on } from '@ember/object/evented';
import C from 'ui/utils/constants';
import { set, get } from '@ember/object';

export default Route.extend({
  session:       service(),
  scope:         service(),
  clusterStore:  service(),
  globalStore:   service(),

  beforeModel() {
    const cluster = window.l('route:application').modelFor('authenticated.cluster');
    const cs = get(this, 'globalStore').getById('clustersetting', get(cluster, 'id'));

    if (!get(cluster, 'isReady')) {
      get(this, 'router').transitionTo('authenticated.cluster.index')
    }

    if ( !cs || !cs.isSetRegistry ) {
      get(this, 'router').transitionTo('authenticated.cluster.index')
    }
  },

  model() {
    return get(this, 'clusterStore').findAll('harborProject');
  },

  setDefaultRoute: on('activate', function() {
    set(this, `session.${ C.SESSION.CLUSTER_ROUTE }`, 'authenticated.cluster.harbor.projects');
  })
});
