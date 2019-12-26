import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import ModalBase from 'shared/mixins/modal-base';
import layout from './template';
import { get } from '@ember/object';

export default Component.extend(ModalBase, {
  layout,
  classNames: ['large-modal', 'alert'],

  errors:          null,
  isContextPath:   false,

  model:      alias('modalService.modalOpts.originalModel'),

  init() {
    this._super(...arguments);
  },

  actions: {
    save(success) {
      let pipeline = get(this, 'model').clone();
      let contextPath = '';

      if ( get(this, 'isContextPath') ) {
        contextPath = get(this, 'subPath');
      }

      pipeline.doAction('sub', {
        subPath:     get(this, 'subPath'),
        contextPath,
      }).then( () => {
        this.send('cancel');
      }).catch(() => {
        success(false);
      });
    }
  },

});
