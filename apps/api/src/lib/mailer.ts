import nodemailer from 'nodemailer';
import { env } from './env';

const transport = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  requireTLS: env.NODE_ENV === 'production' && !env.SMTP_SECURE,
  auth: env.SMTP_USER
    ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD }
    : undefined,
  disableFileAccess: true,
  disableUrlAccess: true,
});

export async function sendMail(message: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> {
  await transport.sendMail({ from: env.SMTP_FROM, ...message });
}
