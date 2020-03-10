import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { get } from '@ember/object';

export default Route.extend({
  session:       service(),
  scope:         service(),
  clusterStore:  service(),
  globalStore:   service(),

  model(params) {
    const project_id = params.project_id;

    return get(this, 'globalStore').find('project', project_id, { forceReload: true }).then((p) => {
      const displayName = get(p, 'displayName').trim().toLowerCase();
      const opt = { filter: { name: displayName } };

      return get(this, 'clusterStore').findAll('harborProject', opt).then((hp) => {
        const hps = hp.filter( (h) => get(h, 'name') === displayName );

        if (hps && hps.length === 1) {
          const hproject = hps[0];
          const project_id = hproject.id;
          const projectName = project_id.split(':')[0];
          const projectId = project_id.split(':')[1];
          const opt = { filter: { project_id } };

          return hash({
            projectName,
            projectId,
            repositories: get(this, 'clusterStore').findAll('harborRepository', opt)
          });
        }

        return hash({
          projectName:  displayName,
          repositories: [],
        });
      });
    });
  },
});
