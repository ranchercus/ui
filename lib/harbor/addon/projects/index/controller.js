import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Controller.extend({
  globalStore: service(),
  scope:       service(),
  growl:       service(),

  currentCluster: alias('scope.currentCluster'),

  init() {
    this._super(...arguments);
  },

  title: computed('scope.currentCluster', function() {
    const clusterId = get(this, 'currentCluster.id');
    const cs = get(this, 'globalStore').getById('clustersetting', clusterId);

    if ( cs && cs.isSetRegistry ) {
      return cs.registrySetting.host
    }
  })
});
