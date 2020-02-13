import Component from '@ember/component';
import ModalBase from 'shared/mixins/modal-base';
import layout from './template';
import { observer } from '@ember/object';
import { get, set, computed, setProperties } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import jsyaml from 'js-yaml';

export default Component.extend(ModalBase, {
  globalStore:  service(),
  intl:         service(),

  category:             '',
  selectedTemplate:     '',
  templateYaml:         '',
  pipelineTemplates:    {},
  params:               [],
  loading:              true,

  layout,
  classNames: ['large-modal', 'alert', 'pipeline-template'],

  save:            alias('modalService.modalOpts.save'),

  init() {
    this._super(...arguments);

    const project = window.l('route:application').modelFor('authenticated.project').get('project');
    const clusterId = project.get('clusterId');
    const opt = { filter: { clusterId } };

    get(this, 'globalStore').findAll('pipelineTemplate', opt).then((hash) => {
      set(this, 'pipelineTemplates', hash);
    }).finally(() => {
      set(this, 'loading', false);
    });
  },

  actions: {
    save(cb) {
      const errors = this.validate();

      if ( errors.length > 0 ) {
        set(this, 'errors', errors);
        cb();

        return;
      }

      const yamlTemplate = get(this, 'ppTemplate');
      const config = jsyaml.safeLoad(yamlTemplate);

      this.save(config);
      get(this, 'modalService').toggleModal();
    },

    cancel() {
      get(this, 'modalService').toggleModal();
    },

    filterCatalog(category, dropdown) {
      if (dropdown && dropdown.isOpen) {
        dropdown.actions.close();
      }
      set(this, 'category', category);
    },
  },

  templateChoicesDidChange: observer('selectedTemplate', function() {
    const id = get(this, 'selectedTemplate');

    if ( id ) {
      const template = get(this, 'pipelineTemplates').findBy('id', id);
      const params = [];

      if ( template && template.questions ) {
        template.questions.forEach((q) => {
          params.push({
            label:           q,
            answer:         '',
          });
        });
      }
      set(this, 'params', params);
      set(this, 'templateYaml', template.template);
    } else {
      set(this, 'templateYaml', '');
    }
  }),

  ppTemplate: computed('templateYaml', 'selectedTemplate', 'params.@each.answer', {
    get() {
      const params = get(this, 'params');
      let yamlValue = get(this, 'templateYaml');
      let key;

      params.forEach((q) => {
        if ( q.answer !== undefined && q.answer !== null && q.answer !== '') {
          key = `\\\${\\s*${ q.label }\\s*}`;
          yamlValue = yamlValue.replace(new RegExp(key, 'ig'), q.answer);
        }
      });

      return yamlValue;
    },

    set(key, value) {
      try {
        jsyaml.safeLoad(value);
      } catch ( err ) {
        set(this, 'yamlErrors', [`YAML Parse Error: ${ err.snippet } - ${ err.message }`]);

        return value;
      }

      setProperties(this, {
        yamlErrors: [],
        valuesYaml: value,
      });

      return value;
    }
  }),

  categories: computed('pipelineTemplates.@each.{categories}', function() {
    let map = {};

    get(this, 'pipelineTemplates').forEach((tpl) => {
      const categories = tpl.categories;

      if ( !categories ){
        return;
      }

      for ( let i = 0 ; i < categories.length ; i++ ) {
        let ctgy = categories[i];
        let normalized = ctgy.underscore();

        if (!map[normalized] ) {
          map[normalized] = {
            name:     ctgy,
            category: normalized,
          };
        }
      }
    });

    return Object.values(map);
  }),

  templateChoices: computed('category', 'pipelineTemplates.@each.{categories}', function() {
    const out = [];
    const category = get(this, 'category');
    const allTemplates = get(this, 'pipelineTemplates') || [];
    const selectedTemplate = get(this, 'selectedTemplate');

    const templates = allTemplates.filter((w) => {
      if (category === '') {
        return true;
      }

      var result = false;

      w.categories.forEach((c) => {
        if (c === category) {
          result = true;
        }
      });

      return result;
    }).sortBy('displayName');

    let _selectedTemplate = '';

    templates.forEach((data) => {
      out.push({
        label: data.displayName,
        value: data.id,
      });

      if ( data.id === selectedTemplate ) {
        _selectedTemplate = selectedTemplate;
      }
    });
    set(this, 'selectedTemplate', _selectedTemplate);

    return out;
  }),

  validate() {
    const params = get(this, 'params');
    const yamlTemplate = get(this, 'ppTemplate');
    const intl = get(this, 'intl');
    const errors = [];

    if ( !yamlTemplate ) {
      errors.push(intl.t('generic.required', { key: '模板内容' }));
    }
    params.forEach((q) => {
      if ( !q.answer ) {
        errors.push(intl.t('generic.required', { key: q.label }));
      }
    });

    return errors;
  }
});
