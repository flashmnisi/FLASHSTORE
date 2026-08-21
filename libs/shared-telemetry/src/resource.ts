import {
  Resource,
  resourceFromAttributes,
} from '@opentelemetry/resources';

import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
  ATTR_DEPLOYMENT_ENVIRONMENT_NAME,
} from '@opentelemetry/semantic-conventions';

export interface TelemetryResourceOptions {
  serviceName: string;
  serviceVersion?: string;
  environment?: string;
}

export function createTelemetryResource(
  options: TelemetryResourceOptions,
): Resource {
  return resourceFromAttributes({
    [ATTR_SERVICE_NAME]: options.serviceName,

    [ATTR_SERVICE_VERSION]:
      options.serviceVersion ?? '1.0.0',

    [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]:
      options.environment ??
      process.env.NODE_ENV ??
      'development',

    'service.namespace': 'flashstore',

    'service.instance.id':
      process.env.HOSTNAME ?? 'local',

    'deployment.cluster': 'flashstore',
  });
}