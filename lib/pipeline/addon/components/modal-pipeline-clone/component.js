import Component from '@ember/component';
import { next } from '@ember/runloop';
import { alias } from '@ember/object/computed';
import ModalBase from 'shared/mixins/modal-base';
import layout from './template';
import { set, get, observer } from '@ember/object';

export default Component.extend(ModalBase, {
  layout,
  classNames: ['large-modal', 'alert'],

  errors:          null,

  config: null,

  model: alias('modalService.modalOpts.originalModel'),

  init() {
    this._super(...arguments);
  },

  actions: {
    save(success) {
      let pipeline = get(this, 'model').clone();

      const id = get(this, 'model.id');

      alert(id);

      success(true);

      get(this, 'router').transitionTo('authenticated.project.pipeline.pipelines.edit', get(this, 'model.id'))

      // pipeline.doAction('pushconfig', { id: 1 }).then(() => {
      //   success(true);
      //   get(this, 'router').transitionTo('authenticated.project.pipeline.pipelines.edit', get(this, 'model.id'))
      // }).catch(() => {
      //   success(false);
      // });
    }
  },

});
