import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { set, get } from '@ember/object';
import ModalBase from 'ui/mixins/modal-base';
import { inject as service } from '@ember/service';
import layout from './template';

export const headers =  [
  {
    name:           'name',
    sort:           ['name'],
    searchField:    'name',
    translationKey: 'harbor.tag.name.label',
  },
  {
    name:           'size',
    sort:           ['size'],
    translationKey: 'harbor.tag.size.label',
  },
  {
    name:           'full_name',
    translationKey: 'harbor.tag.cmd.fullName',
  },
  {
    name:           'author',
    sort:           ['author'],
    translationKey: 'harbor.tag.author.label',
  },
  {
    name:           'created',
    sort:           ['created'],
    translationKey: 'harbor.tag.created.label',
  },
  {
    name:           'docker_version',
    sort:           ['docker_version'],
    translationKey: 'harbor.tag.dockerVersion.label',
  },
  {
    name:           'tag_labels',
    translationKey: 'harbor.tag.tagLabels.label',
  },
];

export default Component.extend(ModalBase, {
  clusterStore:  service(),
  growl:         service(),

  sortBy:      'name',
  headers,
  paging:      true,
  loading:     true,
  repoTags:    [],

  layout,

  modalOpts: alias('modalService.modalOpts'),

  init() {
    this._super(...arguments);

    const repo = get(this, 'modalOpts.repo');
    const opt = { filter: { repo } };

    get(this, 'clusterStore').findAll('harborTag', opt).then((hash) => {
      const repoTags = hash || [];

      set(this, 'repoTags', repoTags.filter( (t) => t.repo === repo ));
    }).catch((err) => {
      get(this, 'growl').fromError(get(err, 'body.message'));
    })
      .finally(() => {
        set(this, 'loading', false);
      });
  },

  actions: {
    close() {
      set(this, 'loading', true);
      this.get('modalService').toggleModal();
    }
  },
});
