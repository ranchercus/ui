import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
  globalStore:  service(),
  scope:        service(),

  model() {
    const globalStore = get(this, 'globalStore');
    const pipelineTemplate = globalStore.createRecord({ type: 'pipelineTemplate' });
    const clusterId = get(this, 'scope.currentCluster.id');

    pipelineTemplate.clusterId = clusterId;

    return pipelineTemplate;
  }
});
