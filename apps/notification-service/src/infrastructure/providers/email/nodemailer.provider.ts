//apps/notification-service/src/infrastructure/kafka/providers/email/nodemailer.provider.ts
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

  const data = notification.templateData || {};

  /**
   * =====================================
   * ORDER ITEMS HTML
   * =====================================
   */
  const itemsHtml = Array.isArray(data.items)
    ? data.items.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.name || 'Product'}
        </td>

        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align:center;">
          ${item.quantity || 1}
        </td>

        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align:right;">
          $${Number(item.price || 0).toFixed(2)}
        </td>
      </tr>
    `).join('')
    : '';

  /**
   * =====================================
   * TEMPLATE TYPES
   * =====================================
   */

  switch (notification.type) {

    /**
     * =====================================
     * USER REGISTERED
     * =====================================
     */
    case 'user.registered':

      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #eee;">

          <div style="background: #111827; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0;">
              Welcome to Flashstore 🎉
            </h1>
          </div>

          <div style="padding: 30px;">

            <h2 style="margin-top:0;">
              Hello ${data.name || 'there'},
            </h2>

            <p style="font-size: 16px; color: #444; line-height: 1.6;">
              Your account has been created successfully.
            </p>

            <p style="font-size: 16px; color: #444; line-height: 1.6;">
              You can now browse products, place orders, and track deliveries.
            </p>

            <a
              href="#"
              style="
                display:inline-block;
                background:#111827;
                color:white;
                padding:14px 24px;
                border-radius:8px;
                text-decoration:none;
                margin-top:20px;
              "
            >
              Start Shopping
            </a>

          </div>

          <div style="padding:20px; text-align:center; color:#888; font-size:12px;">
            Flashstore © ${new Date().getFullYear()}
          </div>

        </div>
      `;

    /**
     * =====================================
     * ORDER CREATED
     * =====================================
     */
    case 'order.created':

      return `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #eee;">

          <div style="background: #16a34a; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0;">
              Order Confirmed ✅
            </h1>
          </div>

          <div style="padding: 30px;">

            <h2 style="margin-top:0;">
              Thank you for your order!
            </h2>

            <p style="font-size: 15px; color:#444;">
              Your order has been successfully placed.
            </p>

            <div style="
              background:#f9fafb;
              padding:20px;
              border-radius:8px;
              margin:20px 0;
            ">

              <p>
                <strong>Order ID:</strong>
                ${data.orderId}
              </p>

              <p>
                <strong>Status:</strong>
                Pending
              </p>

              <p>
                <strong>Total:</strong>
                $${Number(data.totalAmount || 0).toFixed(2)}
              </p>

            </div>

            <h3>
              Order Items
            </h3>

            <table
              width="100%"
              cellspacing="0"
              cellpadding="0"
              style="
                border-collapse: collapse;
                margin-top: 10px;
              "
            >
              <thead>
                <tr style="background:#f3f4f6;">
                  <th style="padding:12px; text-align:left;">
                    Product
                  </th>

                  <th style="padding:12px; text-align:center;">
                    Qty
                  </th>

                  <th style="padding:12px; text-align:right;">
                    Price
                  </th>
                </tr>
              </thead>

              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

          </div>

          <div style="
            padding:20px;
            text-align:center;
            color:#888;
            font-size:12px;
            border-top:1px solid #eee;
          ">
            Flashstore © ${new Date().getFullYear()}
          </div>

        </div>
      `;

    /**
     * =====================================
     * DEFAULT
     * =====================================
     */
    default:

      return `
        <div style="font-family: Arial; padding: 20px;">
          <h2>${notification.title}</h2>
          <p>${notification.message}</p>
        </div>
      `;
  }
}
}