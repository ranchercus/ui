import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import Resource from '@rancher/ember-api-store/models/resource';

export default Resource.extend({
  router:       service(),

  actions: {
    edit() {
      get(this, 'router').transitionTo('authenticated.cluster.pipeline.pipeline-templates.edit', get(this, 'id'));
    }
  },
});
