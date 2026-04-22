import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './infrastructure/config/database';
import { initKafka } from './infrastructure/config/kafka';
import { initMailTransporter } from './infrastructure/config/mail';

import { startNotificationConsumer } from './infrastructure/kafka/consumer';
import { NotificationService } from './application/services/notification.service';
import { NotificationRepositoryImpl } from './infrastructure/persistence/repositories/notification.repository.impl';
import { NodemailerProvider } from './infrastructure/providers/email/nodemailer.provider';
import { TwilioProvider } from './infrastructure/providers/sms/twilio.provider';
import { FirebaseProvider } from './infrastructure/providers/push/firebase.provider';

import { RetryJob } from './jobs/retry.job';
import { DeadLetterJob } from './jobs/dead-letter.job';
import { OutboxWorker } from './jobs/outbox.worker';

import logger from '@org/shared-logger';

const PORT = process.env.PORT || 3006;

const start = async () => {
  try {
    logger.info('🚀 Starting Notification Service...');

    // 1. Initialize infrastructure
    await connectDB();
    await initKafka();
    await initMailTransporter();

    // 2. Initialize providers
    const emailProvider = new NodemailerProvider();
    const smsProvider = new TwilioProvider();
    const pushProvider = new FirebaseProvider();

    // 3. Initialize repository and core service
    const repository = new NotificationRepositoryImpl();
    const notificationService = new NotificationService(
      repository,
      emailProvider,
      smsProvider,
      pushProvider
    );

    // 4. Start Kafka consumer (listens to other services)
    await startNotificationConsumer(notificationService);

    // 5. Start background jobs
    const retryJob = new RetryJob(notificationService);
    const deadLetterJob = new DeadLetterJob();
    const outboxWorker = new OutboxWorker(notificationService);

    // Retry failed notifications
    setInterval(() => {
      retryJob.processFailedNotifications().catch(err => 
        logger.error('Retry Job Error', { error: err.message })
      );
    }, 30000); // every 30 seconds

    // Move permanently failed to dead-letter
    setInterval(() => {
      deadLetterJob.processDeadLetters().catch(err => 
        logger.error('Dead Letter Job Error', { error: err.message })
      );
    }, 300000); // every 5 minutes

    // Process Outbox (reliable delivery)
    setInterval(() => {
      outboxWorker.processOutbox().catch(err => 
        logger.error('Outbox Worker Error', { error: err.message })
      );
    }, 15000); // every 15 seconds

    // 6. Start HTTP server
    app.listen(PORT, () => {
      logger.info(`🚀 Notification Service running on http://localhost:${PORT}`);
    });

  } catch (error: any) {
    logger.error('❌ Failed to start Notification Service', { 
      error: error.message 
    });
    process.exit(1);
  }
};

start();