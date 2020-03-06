import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export const headers =  [
  {
    name:           'name',
    sort:           ['name'],
    searchField:    'name',
    translationKey: 'harbor.repository.name.label',
  },
  {
    name:           'tags_count',
    sort:           ['tags_count'],
    translationKey: 'harbor.repository.tagsCount.label',
  },
  {
    name:           'pull_count',
    sort:           ['pull_count'],
    translationKey: 'harbor.repository.pullCount.label',
  },
];

export default Component.extend({
  modalService: service('modal'),

  sortBy:  'name',
  headers,

  actions: {
    showTags(name) {
      get(this, 'modalService').toggleModal('harbor-tags', { repo: name, });
    }
  },
});
