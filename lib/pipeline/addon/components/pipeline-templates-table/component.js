import Component from '@ember/component';

export const headers =  [
  {
    name:           'displayName',
    sort:           ['displayName'],
    searchField:    'displayName',
    translationKey: 'generic.name',
  },
  {
    name:           'categories',
    sort:           ['categories'],
    searchField:    'categories',
    translationKey: 'pipelineTemplate.category.label',
  },
];

export default Component.extend({
  sortBy:  'name',
  headers,
});
