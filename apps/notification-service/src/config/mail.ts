import nodemailer from 'nodemailer';
import logger from '@org/shared-logger';
import env from './env';

let transporter: nodemailer.Transporter | null = null;

export const initMailTransporter = async () => {
  if (transporter) return transporter;

  try {
    transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });

    // Verify connection
    await transporter.verify();

    logger.info('✅ Mail transporter (Nodemailer) initialized successfully');

    return transporter;
  } catch (error: any) {
    logger.error('❌ Failed to initialize mail transporter', {
      error: error.message,
    });
    throw error;
  }
};

export const getMailTransporter = (): nodemailer.Transporter => {
  if (!transporter) {
    throw new Error(
      'Mail transporter not initialized. Call initMailTransporter first.'
    );
  }
  return transporter;
};
