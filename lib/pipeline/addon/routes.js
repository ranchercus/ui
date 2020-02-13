import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
  // Define your engine's route map here
  this.route('settings', { path: '/' });
  this.route('pipelines', { path: '/pipelines' }, function() {
    this.route('index', { path: '/' });
    this.route('detail', { path: '/:pipeline_id' });
    this.route('edit', { path: '/:pipeline_id/edit' });
    this.route('run', { path: '/:pipeline_id/run/:run_id' });
  });
  this.route('repositories', { path: '/repositories' });

  this.route('pipeline-templates', { path: '/pipeline-templates' }, function() {
    this.route('index', { path: '/' });
    this.route('detail', { path: '/:template_id' });
    this.route('new', { path: '/new' });
    this.route('edit', { path: '/:template_id/edit' });
  });
});
