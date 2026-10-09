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
    } catch (err: unknown) {
      const error = err as Error;
      logger.error('❌ Email sending failed', {
        userId: notification.userId,
        notificationId: notification.id,
        error: error.message,
      });
      throw error;
    }
  }

   private buildTemplate(notification: NotificationEntity): string {
    const data = notification.templateData || {};
    const name = String(data.name || 'Valued Customer');

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

      case 'user.registered':
      case 'welcome-email': {
      return `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
          <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 36px 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Flashstore</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0; font-size: 16px;">
              Your account is ready
            </p>
          </div>

          <div style="padding: 36px 30px;">
            <h2 style="margin: 0 0 12px 0; color: #111827;">Hi ${name},</h2>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
              Thanks for joining <strong>Flashstore</strong>. We’re glad to have you.
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
              You can browse products, manage your cart, and track orders — all in one place.
            </p>

            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 28px;">
              <p style="margin: 0; color: #374151; font-size: 15px;">
                <strong>Your email:</strong> ${data.email || ''}
              </p>
            </div>

            <div style="text-align: center; margin: 28px 0;">
              <a href="https://flashstore.local"
                 style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none;
                        padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Start shopping
              </a>
            </div>

            <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0;">
              If you did not create this account, you can ignore this email.
            </p>
          </div>

          <div style="padding: 25px; text-align: center; color: #6b7280; font-size: 13px; border-top: 1px solid #e5e7eb;">
            Flashstore © ${new Date().getFullYear()} • Johannesburg, South Africa
          </div>
        </div>
      `;
    }
      case 'order.created': {
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
      }

      default:
        return `
        <div style="padding: 30px; font-family: Arial, sans-serif;">
          <h2>${notification.title || 'Notification'}</h2>
          <p>${notification.message}</p>
        </div>
      `;
    }
  }}