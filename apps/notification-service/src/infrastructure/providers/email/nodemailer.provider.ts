// apps/notification-service/src/infrastructure/kafka/providers/email/nodemailer.provider.ts

import nodemailer from 'nodemailer';
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
      secure: false,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });
  }

  async send(notification: NotificationEntity): Promise<void> {
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
        to: email,
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
      throw err;
    }
  }

  private buildTemplate(notification: NotificationEntity): string {
    const data = notification.templateData || {};

    const itemsHtml = Array.isArray(data.items)
      ? data.items
          .map(
            (item: any) => `
      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #eee;">
          ${item.name || 'Product'}
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #eee; text-align:center;">
          ${item.quantity || 1}
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #eee; text-align:right;">
          $${Number(item.price || 0).toFixed(2)}
        </td>
      </tr>
    `
          )
          .join('')
      : '';

    switch (notification.type) {
      case 'order.created':
        const itemsTotal = Number(data.itemsTotal || 0);
        const shippingPrice = Number(data.shippingPrice || 0);
        const totalAmount = Number(data.totalAmount || 0);

        return `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">

          <!-- Header -->
          <div style="background: #16a34a; padding: 30px 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">
              Order Confirmed ✅
            </h1>
          </div>

          <div style="padding: 35px 30px;">

            <h2 style="margin: 0 0 8px 0;">Thank you for your order!</h2>
            <p style="color: #374151; font-size: 16px;">
              Your order has been successfully placed.
            </p>

            <!-- Order Summary -->
            <div style="background:#f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p><strong>Status:</strong> Pending</p>
            </div>

            <!-- Items Table -->
            <h3 style="margin-bottom: 12px;">Order Items</h3>
            <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 25px;">
              <thead>
                <tr style="background:#f3f4f6;">
                  <th style="padding: 12px; text-align:left;">Product</th>
                  <th style="padding: 12px; text-align:center;">Qty</th>
                  <th style="padding: 12px; text-align:right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Price Breakdown -->
            <div style="background:#f9fafb; padding: 20px; border-radius: 8px;">
              <table width="100%" style="border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0;">Subtotal</td>
                  <td style="text-align:right; padding: 8px 0;">$${itemsTotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">Shipping</td>
                  <td style="text-align:right; padding: 8px 0;">$${shippingPrice.toFixed(2)}</td>
                </tr>
                <tr style="border-top: 2px solid #e5e7eb; font-weight: bold;">
                  <td style="padding: 12px 0 8px 0;">Total</td>
                  <td style="text-align:right; padding: 12px 0 8px 0; font-size: 18px;">
                    $${totalAmount.toFixed(2)}
                  </td>
                </tr>
              </table>
            </div>

          </div>

          <!-- Footer -->
          <div style="padding: 25px; text-align: center; color: #6b7280; font-size: 13px; border-top: 1px solid #e5e7eb;">
            Flashstore © ${new Date().getFullYear()} • Johannesburg, South Africa
          </div>

        </div>
      `;

      case 'user.registered':
        return `...`; // Keep your existing welcome template or let me know if you want it improved

      default:
        return `
        <div style="padding: 30px; font-family: Arial, sans-serif;">
          <h2>${notification.title || 'Notification'}</h2>
          <p>${notification.message}</p>
        </div>
      `;
    }
  }
}