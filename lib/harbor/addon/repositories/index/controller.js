import Controller from '@ember/controller';
import { computed, get } from '@ember/object';

export default Controller.extend({
  repositories:  computed('model.repositories.@each.{project_id}', function() {
    const projectId = get(this, 'model.projectId');

    return get(this, 'model.repositories').filter( (repository) => get(repository, 'project_id') === parseInt(projectId) );
  })
});
