// apps/gateway/src/infrastructure/kafka/producer.ts

import { publish } from '@org/shared-kafka';

import logger from '@org/shared-logger';

import { TOPICS } from './topics';


import {
  buildGatewayErrorEvent,
} from './events/gateway-error.event';
import { buildGatewayRequestEvent } from './events/gatway-request.event';
import { buildServiceUnavailableEvent } from './events/service-unavailable.even';

export class GatewayProducer {

  /**
   * =====================================
   * SAFE PUBLISH
   * =====================================
   */
  private async safePublish(
    payload: any
  ) {

    let retries = 3;

    while (retries > 0) {

      try {

        await publish(payload);

        return;

      } catch (error: any) {

        retries--;

        logger.warn(
          '⚠️ Kafka publish retry',
          {
            retries,
            error: error.message,
          }
        );

        if (retries === 0) {
          throw error;
        }

        await new Promise(resolve =>
          setTimeout(resolve, 500)
        );

      }

    }

  }

  /**
   * =====================================
   * REQUEST EVENT
   * =====================================
   */
  async publishRequestEvent(
    req: any,
    serviceName: string,
    status: number
  ) {

    try {

      const event =
        buildGatewayRequestEvent(
          req,
          serviceName,
          status
        );

      await this.safePublish({
        topic: TOPICS.GATEWAY,

        key:
          req.correlationId ||
          req.id ||
          'unknown',

        message: event,
      });

    } catch (error: any) {

      logger.error(
        '❌ Failed to publish request event',
        {
          service: serviceName,
          error: error.message,
        }
      );

    }

  }

  /**
   * =====================================
   * ERROR EVENT
   * =====================================
   */
  async publishErrorEvent(
    req: any,
    serviceName: string,
    error: any
  ) {

    try {

      const event =
        buildGatewayErrorEvent(
          req,
          serviceName,
          error
        );

      await this.safePublish({
        topic: TOPICS.GATEWAY,

        key:
          req.correlationId ||
          req.id ||
          'error',

        message: event,
      });

    } catch (err: any) {

      logger.error(
        '❌ Failed to publish error event',
        {
          service: serviceName,
          error: err.message,
        }
      );

    }

  }

  /**
   * =====================================
   * SERVICE UNAVAILABLE EVENT
   * =====================================
   */
  async publishServiceUnavailableEvent(
    req: any,
    serviceName: string
  ) {

    try {

      const event =
        buildServiceUnavailableEvent(
          req,
          serviceName
        );

      await this.safePublish({
        topic: TOPICS.GATEWAY,

        key:
          req.correlationId ||
          req.id ||
          'unavailable',

        message: event,
      });

    } catch (error: any) {

      logger.error(
        '❌ Failed to publish unavailable event',
        {
          service: serviceName,
          error: error.message,
        }
      );

    }

  }

}

export const gatewayProducer =
  new GatewayProducer();