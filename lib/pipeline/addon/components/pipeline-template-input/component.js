import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  router:          service(),
  intl:            service(),
  growl:           service(),

  loading:            true,
  isView:             false,

  init() {
    this._super(...arguments);
  },

  actions: {
    save(cb) {
      const errors = this.validate();

      if ( errors.length > 0 ) {
        set(this, 'errors', errors);
        cb();

        return;
      }

      get(this, 'model').save()
        .then(() => {
          this.send('cancel');
        })
        .catch( (err) => {
          get(this, 'growl').fromError(err.message);
        })
        .finally(() => {
          cb();
        });
    },
    cancel(){
      get(this, 'router').transitionTo('authenticated.cluster.pipeline.pipeline-templates');
    },
  },

  validate() {
    const categories = get(this, 'model.categories');
    const name = get(this, 'model.name');
    const template = get(this, 'model.template');
    const intl = get(this, 'intl');
    const errors = [];

    if ( !name ) {
      errors.push(intl.t('generic.required', { key: intl.t(`generic.name`) }));
    }
    if ( !template ) {
      errors.push(intl.t('generic.required', { key: intl.t(`pipelineTemplate.template.label`) }));
    }
    if ( !categories ) {
      errors.push(intl.t('generic.required', { key: intl.t(`pipelineTemplate.category.label`) }));
    } else {
      let emptyCount = 0;

      categories.forEach((c) => {
        if ( !c ) {
          emptyCount++;
        }
      });
      if ( emptyCount === categories.length ) {
        errors.push(intl.t('generic.required', { key: intl.t(`pipelineTemplate.category.label`) }));
      }
    }

    return errors;
  }
});
