import nodemailer from 'nodemailer';
//import logger, { error, info } from '@org/shared-logger';
import { NotificationEntity } from '../../../domain/entities/notification.entity';
import env from '../../../config/env';
import { IEmailProvider } from '../../../application/interfaces/email.provider';
import logger from '@org/shared-logger';

export class NodemailerProvider implements IEmailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });
  }

  async send(notification: NotificationEntity): Promise<void> {
    // Extract email safely
    const email = notification.templateData?.email as string | undefined;

    if (!email) {
      logger.error('❌ Missing recipient email', {
  notificationId: notification.id,
  userId: notification.userId,
});
      throw new Error('Email address is required in templateData.email');
    }

    const html = this.buildTemplate(notification);

    try {
      const result = await this.transporter.sendMail({
        from: `"Flashstore" <${env.EMAIL_USER}>`,
        to: email,                                   // ← Now guaranteed string
        subject: notification.title || 'Notification from Flashstore',
        html,
      });

      logger.info('📧 Email sent successfully', {
  messageId: result.messageId,
  userId: notification.userId,
  notificationId: notification.id,
  to: email,
});

    } catch (err: any) {
      logger.error('❌ Email sending failed', {
  userId: notification.userId,
  notificationId: notification.id,
  error: err.message,
});

      throw err; // Let the caller handle retry / DLQ
    }
  }

  private buildTemplate(notification: NotificationEntity): string {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${notification.title || 'Flashstore Notification'}</h2>
        
        ${notification.message ? `<p style="font-size: 16px; line-height: 1.6;">${notification.message}</p>` : ''}

        ${
          notification.templateData && Object.keys(notification.templateData).length > 0
            ? `
        <div style="background:#f8f9fa; padding:15px; border-radius:6px; margin:15px 0;">
          <strong>Template Data:</strong><br>
          <pre style="white-space: pre-wrap; font-size: 13px;">${JSON.stringify(notification.templateData, null, 2)}</pre>
        </div>`
            : ''
        }

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        
        <small style="color: gray;">
          This is an automated notification from Flashstore • ${new Date().toLocaleDateString()}
        </small>
      </div>
    `;
  }
}