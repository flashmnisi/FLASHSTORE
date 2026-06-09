import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDatabase } from './config/database';
import { initKafka } from './config/kafka';
import { initMailTransporter } from './config/mail';

import { startNotificationConsumer } from './infrastructure/kafka/consumer';
import { NotificationService } from './application/services/notification.service';
import { NotificationRepositoryImpl } from './infrastructure/persistence/database/repositories/notification.repository.impl';
import { NodemailerProvider } from './infrastructure/providers/email/nodemailer.provider';
import { TwilioProvider } from './infrastructure/providers/sms/twilio.provider';
import { FirebaseProvider } from './infrastructure/providers/push/firebase.provider';

import { RetryJob } from './jobs/retry.job';
import { DeadLetterJob } from './jobs/dead-letter.job';

import logger from '@org/shared-logger';
import { OutboxService } from './infrastructure/outbox/outbox.service';
import { OutboxRepository } from './infrastructure/outbox/outbox.repository';
import { OutboxProcessor } from './infrastructure/outbox/outbox.processor';

const PORT = process.env.PORT || 3006;

const start = async () => {
  try {
    logger.info('🚀 Starting Notification Service...');

    await connectDatabase();
    await initKafka();
    await initMailTransporter();

    // Providers & Services
    const emailProvider = new NodemailerProvider();
    const smsProvider = new TwilioProvider();
    const pushProvider = new FirebaseProvider();

    const repository = new NotificationRepositoryImpl();
    const outboxRepository = new OutboxRepository();
    const outboxService = new OutboxService(outboxRepository);

    const notificationService = new NotificationService(
      repository,
      emailProvider,
      smsProvider,
      pushProvider,
      outboxService
    );

    // Start Kafka Consumer
    await startNotificationConsumer(notificationService);

    // ==================== OUTBOX PROCESSOR ====================
    const outboxProcessor = new OutboxProcessor(outboxService);
    outboxProcessor.start();

    // ==================== BACKGROUND JOBS ====================
    const retryJob = new RetryJob(notificationService);
    const deadLetterJob = new DeadLetterJob();

    // Only keep these two jobs
    setInterval(() => {
      retryJob.processFailedNotifications().catch(err => 
        logger.error('Retry Job Error', { error: err.message })
      );
    }, 45000); // ← Increased to 45 seconds

    setInterval(() => {
      deadLetterJob.processDeadLetters().catch(err => 
        logger.error('Dead Letter Job Error', { error: err.message })
      );
    }, 300000);

    app.listen(PORT, () => {
      logger.info(`🚀 Notification Service running on http://localhost:${PORT}`);
    });

  } catch (error: any) {
    logger.error('❌ Failed to start Notification Service', { error: error.message });
    process.exit(1);
  }
};

start();