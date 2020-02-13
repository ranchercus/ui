import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
  globalStore:  service(),

  model(params) {
    const globalStore = get(this, 'globalStore');

    return globalStore.find('pipelineTemplate', params.template_id);
  }
});
