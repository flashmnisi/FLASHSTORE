import nodemailer from 'nodemailer';
import logger from '@org/shared-logger';
import { NotificationEntity } from '../../../domain/entities/notification.entity';
import { IEmailProvider } from '../../interfaces/email.provider';
import env from '../../../config/env';

export class NodemailerProvider implements IEmailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });
  }

  async send(notification: NotificationEntity): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Flashstore" <${env.EMAIL_USER}>`,
        to: notification.data?.email || 'no-reply@flashstore.com',
        subject: notification.title,
        html: `
          <h2>${notification.title}</h2>
          <p>${notification.message}</p>
          ${notification.data ? `<p><strong>Data:</strong> ${JSON.stringify(notification.data)}</p>` : ''}
          <hr>
          <small>This is an automated notification from Flashstore.</small>
        `,
      });

      logger.info(`✅ Email sent successfully to ${notification.userId}`);
    } catch (error: any) {
      logger.error(`❌ Failed to send email`, { userId: notification.userId, error: error.message });
      throw error;
    }
  }
}