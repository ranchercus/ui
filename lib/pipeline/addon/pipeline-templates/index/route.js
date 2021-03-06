import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { set, get } from '@ember/object';
import { on } from '@ember/object/evented';
import C from 'ui/utils/constants';

export default Route.extend({
  globalStore:  service(),
  session:      service(),

  beforeModel() {
    const cluster = window.l('route:application').modelFor('authenticated.cluster');

    if (!get(cluster, 'isReady')) {
      get(this, 'router').transitionTo('authenticated.cluster.index')
    }
  },

  model() {
    return get(this, 'globalStore').findAll('pipelineTemplate');
  },

  setDefaultRoute: on('activate', function() {
    set(this, `session.${ C.SESSION.CLUSTER_ROUTE }`, 'authenticated.cluster.pipeline.pipeline-templates.index');
  }),
});
