import Resource from '@rancher/ember-api-store/models/resource';
import { computed } from '@ember/object';
import { notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';

const cloudCredential = Resource.extend({
  modal:    service(),
  type:     'cloudCredential',

  canClone: false,
  canEdit:  true,

  isAmazon: notEmpty('amazonec2credentialConfig'),
  isAzure:  notEmpty('azurecredentialConfig'),
  isDo:     notEmpty('digitaloceancredentialConfig'),
  isLinode: notEmpty('linodecredentialConfig'),
  isVMware: notEmpty('vmwarevspherecredentialConfig'),

  displayType: computed('amazonec2credentialConfig', 'azurecredentialConfig', 'digitaloceancredentialConfig', 'linodecredentialConfig', 'vmwarevspherecredentialConfig', function() {
    const {
      isAmazon,
      isAzure,
      isDo,
      isLinode,
      isVMware
    } = this;

    if (isAmazon) {
      return 'Amazon';
    } else if (isAzure) {
      return 'Azure';
    } else if (isDo) {
      return 'Digital Ocean';
    } else if (isLinode) {
      return 'Linode';
    } else if (isVMware) {
      return 'VMware vSphere';
    }
  }),


  actions: {
    edit() {
      this.modal.toggleModal('modal-add-cloud-credential', {
        cloudCredential: this,
        mode:            'edit',
      });
    }
  },
});

export default cloudCredential;
