import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
  // Define your engine's route map here
  this.route('projects', { path: '/projects' }, function() {
    this.route('index', { path: '/' });
  });
  this.route('repositories', { path: '/repositories' }, function() {
    this.route('index', { path: '/c/:project_id' });
    this.route('project', { path: '/p/:project_id' });
  });
  this.route('tags', { path: '/tags' }, function() {
    this.route('index', { path: '/' });
  });
});
