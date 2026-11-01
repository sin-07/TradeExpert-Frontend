import nodemailer from 'nodemailer';

/**
 * Create email transporter using Gmail
 */
export const createTransporter = () => {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASSWORD?.trim();

  if (!user || !pass) {
    console.log('[EMAIL] ⚠️ EMAIL_USER or EMAIL_PASSWORD not configured - emails will be logged to console only');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};
