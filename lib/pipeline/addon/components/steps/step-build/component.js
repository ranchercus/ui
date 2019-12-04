import Component from '@ember/component';
import layout from './template';
import { get } from '@ember/object';
import { alias } from '@ember/object/computed';
import Step from 'pipeline/mixins/step';
import { set } from '@ember/object';

const DEFAULT_CONFIG = {
  dockerfilePath: './Dockerfile',
  buildContext:   '.',
  tag:            '',
  pushRemote:     false,
  registry:       '',
};

export default Component.extend(Step, {
  layout,

  config:        null,
  field:         'publishImageConfig',
  defaultConfig: DEFAULT_CONFIG,

  registries: alias('projectDockerCredentials'),

  validate() {
    const intl = get(this, 'intl');
    const errors = [];
    const config = get(this, 'config.publishImageConfig');

    if ( !config.tag || config.tag.trim() === '' ) {
      errors.push(intl.t('newPipelineStep.stepType.build.errors.tag.required'));
    }

    if ( !config.dockerfilePath || config.dockerfilePath.trim() === '' ) {
      errors.push(intl.t('newPipelineStep.stepType.build.errors.dockerfilePath.required'));
    }

    if ( config.pushRemote && ( !config.registry || config.registry.trim() === '' ) ) {
      errors.push(intl.t('newPipelineStep.stepType.build.errors.registry.required'));
    }

    if ( config.deploy ) {
      this.validateField('targetNamespace', errors);
      this.validateField('workloadId', errors);
    }

    return errors;
  },

  validateField(key, errors) {
    const intl = get(this, 'intl');
    const config = get(this, 'config.publishImageConfig');

    if ( !get(config, key) || get(config, key).trim() === '' ) {
      errors.push(intl.t('generic.required', { key: intl.t(`newPipelineStep.stepType.build.${ key }.label`) }));
    }
  },

  willSave() {
    const cindex = get(this, 'config.publishImageConfig.containerIndex');
    const deploy = get(this, 'config.publishImageConfig.deploy');
    const pushRemote = get(this, 'config.publishImageConfig.pushRemote');

    if ( !pushRemote ) {
      set(this, 'config.publishImageConfig.registry', undefined);
      set(this, 'config.publishImageConfig.callbackScript', undefined);
      set(this, 'config.publishImageConfig.callbackScriptParams', undefined);
    }

    if ( deploy ) {
      if ( cindex !== '' ) {
        set(this, 'config.publishImageConfig.containerIndex', parseInt(cindex));
      } else {
        set(this, 'config.publishImageConfig.containerIndex', 1);
      }

      const ns = get(this, 'config.publishImageConfig.targetNamespace');
      const workloadId = get(this, 'config.publishImageConfig.workloadId');
      const workload = workloadId.split(':');

      if ( workload.length === 1 ) {
        set(this, 'config.publishImageConfig.workloadId', `deployment:${ ns }:${ workloadId }`);
      }
    } else {
      set(this, 'config.publishImageConfig.containerIndex', undefined);
      set(this, 'config.publishImageConfig.targetNamespace', undefined);
      set(this, 'config.publishImageConfig.workloadId', undefined);
      set(this, 'config.publishImageConfig.port', undefined);
      set(this, 'config.publishImageConfig.deployService', undefined);
    }
  },

});
