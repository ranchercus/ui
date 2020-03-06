import Component from '@ember/component';

export const headers =  [
  {
    name:           'name',
    sort:           ['name'],
    searchField:    'name',
    translationKey: 'harbor.project.name.label',
  },
  {
    name:           'public',
    sort:           ['harborMeta.public'],
    translationKey: 'harbor.project.public.label',
  },
  {
    name:           'current_user_role_id',
    sort:           ['current_user_role_id'],
    translationKey: 'harbor.project.role.label',
  },
  {
    name:           'repo_count',
    sort:           ['repo_count'],
    translationKey: 'harbor.project.repoCount.label',
  },
  {
    name:           'creation_time',
    sort:           ['creation_time'],
    translationKey: 'harbor.project.creationTime.label',
  },
];

export default Component.extend({
  sortBy:  'name',
  headers,
});
