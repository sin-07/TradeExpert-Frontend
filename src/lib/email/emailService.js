import { createTransporter } from './emailConfig.js';
import { 
  otpEmailTemplate, 
  welcomeEmailTemplate, 
  orderConfirmationEmailTemplate, 
  forgotPasswordEmailTemplate 
} from './emailTemplates.js';

const sendViaResend = async ({ email, subject, html, text }) => {
  if (!process.env.RESEND_API_KEY) return null;

  try {
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'TradeXpert <onboarding@resend.dev>';

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [email],
        subject,
        html,
        text
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Resend API ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Email sent successfully via Resend:', data.id);
    return { success: true, messageId: data.id, mode: 'resend' };
  } catch (error) {
    console.error('❌ Resend API error:', error.message);
    return { success: false, error };
  }
};

export const sendOTPEmail = async (email, otp, userName) => {
  console.log('\n' + '='.repeat(60));
  console.log('📬 OTP VERIFICATION EMAIL');
  console.log('='.repeat(60));
  console.log('To:', email);
  console.log('Name:', userName);
  console.log('🔑 YOUR OTP CODE:', otp);
  console.log('⏰ Valid for: 10 minutes');
  console.log('='.repeat(60) + '\n');

  const subject = 'Your TradeXpert Verification Code';
  const html = otpEmailTemplate(otp, userName);
  const text = `Hello ${userName || ''}\n\nYour TradeXpert verification code is ${otp}. The code expires in 10 minutes.`;

  if (process.env.RESEND_API_KEY) {
    const resendResult = await sendViaResend({ email, subject, html, text });
    if (resendResult?.success) return resendResult;
  }

  const transporter = createTransporter();
  if (!transporter) {
    return { success: true, messageId: 'console-log', mode: 'console' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"TradeXpert" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
      text,
    });
    console.log('✅ OTP email sent successfully via Gmail:', info.messageId);
    return { success: true, messageId: info.messageId, mode: 'gmail' };
  } catch (error) {
    console.error('❌ Error sending OTP email:', error.message);
    return { success: false, error: error.message, mode: 'gmail-error' };
  }
};

export const sendWelcomeEmail = async (email, userName) => {
  console.log('\n' + '='.repeat(60));
  console.log('🎉 WELCOME TO TRADEXPERT');
  console.log('='.repeat(60));
  console.log('To:', email);
  console.log('Name:', userName);
  console.log('='.repeat(60) + '\n');

  const subject = '🎉 Welcome to TradeXpert - Your Trading Journey Begins!';
  const html = welcomeEmailTemplate(userName);
  const text = `Hi ${userName || ''},\n\nWelcome to TradeXpert! Your account is verified.`;

  if (process.env.RESEND_API_KEY) {
    const resendResult = await sendViaResend({ email, subject, html, text });
    if (resendResult?.success) return resendResult;
  }

  const transporter = createTransporter();
  if (!transporter) {
    return { success: true, messageId: 'console-log', mode: 'console' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"TradeXpert" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
      text,
    });
    return { success: true, messageId: info.messageId, mode: 'gmail' };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    return { success: false, error: error.message, mode: 'error-fallback' };
  }
};

export const sendOrderConfirmationEmail = async (email, userName, orderDetails) => {
  console.log('\n' + '='.repeat(60));
  console.log(`📊 ORDER ${orderDetails.side.toUpperCase()} CONFIRMATION`);
  console.log('='.repeat(60));
  console.log('To:', email);
  console.log('Symbol:', orderDetails.symbol);
  console.log('Action:', orderDetails.side);
  console.log('Quantity:', orderDetails.quantity);
  console.log('Price:', `₹${orderDetails.price.toFixed(2)}`);
  console.log('='.repeat(60) + '\n');

  const subject = `${orderDetails.side === 'Buy' ? '✅' : '💰'} Order ${orderDetails.side} Confirmation - ${orderDetails.symbol}`;
  const html = orderConfirmationEmailTemplate(userName, orderDetails);
  const text = `Hi ${userName || ''},\n\nYour order ${orderDetails.orderId} to ${orderDetails.side} ${orderDetails.quantity} ${orderDetails.symbol} at ₹${orderDetails.price.toFixed(2)} has been executed.`;

  if (process.env.RESEND_API_KEY) {
    const resendResult = await sendViaResend({ email, subject, html, text });
    if (resendResult?.success) return resendResult;
  }

  const transporter = createTransporter();
  if (!transporter) {
    return { success: true, messageId: 'console-log', mode: 'console' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"TradeXpert Trading" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
      text,
    });
    return { success: true, messageId: info.messageId, mode: 'gmail' };
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error.message);
    return { success: false, error: error.message, mode: 'error-fallback' };
  }
};

export const sendPasswordResetEmail = async (email, resetToken, userName) => {
  console.log('\n' + '='.repeat(60));
  console.log('🔑 PASSWORD RESET EMAIL');
  console.log('='.repeat(60));
  console.log('To:', email);
  console.log('Reset Code:', resetToken);
  console.log('='.repeat(60) + '\n');

  const subject = 'Reset Your TradeXpert Password';
  const html = forgotPasswordEmailTemplate(userName, resetToken);
  const text = `Hello ${userName || ''},\n\nUse the reset code ${resetToken} to reset your password.`;

  if (process.env.RESEND_API_KEY) {
    const resendResult = await sendViaResend({ email, subject, html, text });
    if (resendResult?.success) return resendResult;
  }

  const transporter = createTransporter();
  if (!transporter) {
    return { success: true, messageId: 'console-log', mode: 'console' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"TradeXpert" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
      text,
    });
    return { success: true, messageId: info.messageId, mode: 'gmail' };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    return { success: true, messageId: 'console-fallback', mode: 'error-fallback' };
  }
};
