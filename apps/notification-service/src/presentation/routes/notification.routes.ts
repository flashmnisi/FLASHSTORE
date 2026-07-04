import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { NotificationService } from '../../application/services/notification.service';
import { NotificationRepositoryImpl } from '../../infrastructure/persistence/database/repositories/notification.repository.impl';
import { NodemailerProvider } from '../../infrastructure/providers/email/nodemailer.provider';
import { TwilioProvider } from '../../infrastructure/providers/sms/twilio.provider';
import { FirebaseProvider } from '../../infrastructure/providers/push/firebase.provider';
import { OutboxService } from '../../infrastructure/outbox/outbox.service';
import { OutboxRepository } from '../../infrastructure/outbox/outbox.repository';

const router = Router();

// Initialize dependencies (in real app, use dependency injection container)
const repository = new NotificationRepositoryImpl();
const emailProvider = new NodemailerProvider();
const smsProvider = new TwilioProvider();
const pushProvider = new FirebaseProvider();
const outboxRepository = new OutboxRepository();
const outboxService = new OutboxService(outboxRepository);

const notificationService = new NotificationService(
  repository,
  emailProvider,
  smsProvider,
  pushProvider,
  outboxService
);

const controller = new NotificationController(notificationService);

// Send notification endpoint
router.post('/send', controller.sendNotification.bind(controller));

export default router;