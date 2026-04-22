import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { NotificationService } from '../../application/services/notification.service';
import { NotificationRepositoryImpl } from '../../infrastructure/persistence/repositories/notification.repository.impl';
import { NodemailerProvider } from '../../infrastructure/providers/email/nodemailer.provider';
import { TwilioProvider } from '../../infrastructure/providers/sms/twilio.provider';
import { FirebaseProvider } from '../../infrastructure/providers/push/firebase.provider';

const router = Router();

// Initialize dependencies (in real app, use dependency injection container)
const repository = new NotificationRepositoryImpl();
const emailProvider = new NodemailerProvider();
const smsProvider = new TwilioProvider();
const pushProvider = new FirebaseProvider();

const notificationService = new NotificationService(
  repository,
  emailProvider,
  smsProvider,
  pushProvider
);

const controller = new NotificationController(notificationService);

// Send notification endpoint (for manual testing or internal calls)
router.post('/send', controller.sendNotification.bind(controller));

export default router;