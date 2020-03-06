import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { get } from '@ember/object';

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

  model(params) {
    const project_id = params.project_id;
    const projectName = project_id.split(':')[0];
    const projectId = project_id.split(':')[1];
    const opt = { filter: { project_id } };

    return hash({
      projectName,
      projectId,
      repositories: get(this, 'clusterStore').findAll('harborRepository', opt)
    });
  },
});
