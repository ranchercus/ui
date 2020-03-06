import Resource from '@rancher/ember-api-store/models/resource';
import { computed, get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Resource.extend({
  globalStore: service(),

  type: 'clustersetting',

  isSetRegistry: computed('registrySetting.host', function() {
    let registrySetting = get(this, 'registrySetting');

    if ( registrySetting && registrySetting.host ) {
      return true;
    } else {
      return false;
    }
  }),

});
