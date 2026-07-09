import nodemailer from 'nodemailer';
import logger from '@org/shared-logger';
import env from './env';

let transporter: nodemailer.Transporter | null = null;

export const initMailTransporter = async () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: Number(env.EMAIL_PORT),
    secure: false,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  try {
    await transporter.verify();

    logger.info('✅ Mail transporter initialized successfully');
  } catch (error: any) {
    logger.warn('⚠️ Mail transporter unavailable', {
      error: error.message,
    });

    // Don't throw
  }

  return transporter;
};

export const getMailTransporter = (): nodemailer.Transporter => {
  if (!transporter) {
    throw new Error(
      'Mail transporter not initialized. Call initMailTransporter first.'
    );
  }
  return transporter;
};
