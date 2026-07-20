// backend/src/utils/emailService.js
// ✅ NEW - Email Service for AI Tour Rwanda

import nodemailer from 'nodemailer';

// ─── Email Transporter ──────────────────────────────────────────
let transporter = null;

/**
 * Create email transporter
 */
const createTransporter = () => {
  if (transporter) return transporter;

  // Check if email is configured
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ Email service not configured. Using mock email service.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transporter;
};

// ─── Send Email ──────────────────────────────────────────────────
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();

    // If email is not configured, log and return
    if (!transporter) {
      console.log(`📧 [MOCK] Email sent to ${to}`);
      console.log(`📧 Subject: ${subject}`);
      console.log(`📧 Content: ${html?.substring(0, 200)}...`);
      return { success: true, mock: true };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@aitourrwanda.com',
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    throw error;
  }
};

// ─── Verification Email ─────────────────────────────────────────
export const sendVerificationEmail = async (user) => {
  const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${user.verificationToken || ''}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #0D9488; }
        .header h1 { color: #0D9488; margin: 0; font-size: 28px; }
        .content { padding: 30px 20px; }
        .content p { color: #374151; line-height: 1.6; font-size: 16px; }
        .button { display: inline-block; padding: 14px 30px; background: linear-gradient(135deg, #0D9488, #F59E0B); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 14px; }
        .footer a { color: #0D9488; text-decoration: none; }
        .badge { display: inline-block; padding: 4px 12px; background: #0D9488; color: white; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .highlight { color: #0D9488; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌍 AI Tour Rwanda</h1>
          <span class="badge">Verify Email</span>
        </div>
        <div class="content">
          <h2 style="color: #374151;">Welcome to AI Tour Rwanda! 🎉</h2>
          <p>Hi <strong>${user.name || 'there'}</strong>,</p>
          <p>Thank you for signing up for <span class="highlight">AI Tour Rwanda</span>. We're excited to help you discover the beauty of Rwanda with AI-powered travel planning.</p>
          <p>Please verify your email address by clicking the button below:</p>
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </div>
          <p style="font-size: 14px; color: #6b7280;">This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
          <p style="font-size: 14px; color: #6b7280;">Or copy and paste this link into your browser:</p>
          <p style="font-size: 12px; color: #6b7280; word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} AI Tour Rwanda. All rights reserved.</p>
          <p>
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}">Visit our website</a> •
            <a href="mailto:support@aitourrwanda.com">Contact Support</a>
          </p>
          <p style="font-size: 12px; color: #9ca3af;">
            Kigali, Rwanda 🇷🇼
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Welcome to AI Tour Rwanda!
    
    Hi ${user.name || 'there'},
    
    Thank you for signing up for AI Tour Rwanda. We're excited to help you discover the beauty of Rwanda with AI-powered travel planning.
    
    Please verify your email address by visiting this link:
    ${verificationUrl}
    
    This link will expire in 24 hours.
    
    If you didn't create an account, you can safely ignore this email.
    
    © ${new Date().getFullYear()} AI Tour Rwanda. All rights reserved.
    Kigali, Rwanda 🇷🇼
  `;

  return sendEmail({
    to: user.email,
    subject: 'Verify Your Email - AI Tour Rwanda',
    html,
    text,
  });
};

// ─── Welcome Email ──────────────────────────────────────────────
export const sendWelcomeEmail = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to AI Tour Rwanda</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #0D9488; }
        .header h1 { color: #0D9488; margin: 0; font-size: 28px; }
        .content { padding: 30px 20px; }
        .content p { color: #374151; line-height: 1.6; font-size: 16px; }
        .button { display: inline-block; padding: 14px 30px; background: linear-gradient(135deg, #0D9488, #F59E0B); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 14px; }
        .footer a { color: #0D9488; text-decoration: none; }
        .highlight { color: #0D9488; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌍 AI Tour Rwanda</h1>
        </div>
        <div class="content">
          <h2 style="color: #374151;">Welcome to AI Tour Rwanda! 🎉</h2>
          <p>Hi <strong>${user.name || 'there'}</strong>,</p>
          <p>Your account has been successfully verified! You're now ready to explore the beauty of Rwanda with <span class="highlight">AI Tour Rwanda</span>.</p>
          <div style="text-align: center;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/explore" class="button">Start Exploring</a>
          </div>
          <h3 style="color: #374151; margin-top: 30px;">What you can do now:</h3>
          <ul style="color: #4b5563; line-height: 2;">
            <li>🔍 <strong>Explore</strong> - Discover amazing tours and experiences</li>
            <li>🤖 <strong>AI Planner</strong> - Get personalized travel recommendations</li>
            <li>📅 <strong>Book</strong> - Reserve your perfect adventure</li>
            <li>⭐ <strong>Review</strong> - Share your experiences with the community</li>
          </ul>
          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
            If you have any questions, feel free to <a href="mailto:support@aitourrwanda.com" style="color: #0D9488;">contact our support team</a>.
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} AI Tour Rwanda. All rights reserved.</p>
          <p>Kigali, Rwanda 🇷🇼</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Welcome to AI Tour Rwanda!
    
    Hi ${user.name || 'there'},
    
    Your account has been successfully verified! You're now ready to explore the beauty of Rwanda with AI Tour Rwanda.
    
    Start exploring: ${process.env.CLIENT_URL || 'http://localhost:5173'}/explore
    
    What you can do now:
    - Explore - Discover amazing tours and experiences
    - AI Planner - Get personalized travel recommendations
    - Book - Reserve your perfect adventure
    - Review - Share your experiences with the community
    
    If you have any questions, feel free to contact us at support@aitourrwanda.com
    
    © ${new Date().getFullYear()} AI Tour Rwanda. All rights reserved.
    Kigali, Rwanda 🇷🇼
  `;

  return sendEmail({
    to: user.email,
    subject: 'Welcome to AI Tour Rwanda! 🎉',
    html,
    text,
  });
};

// ─── Password Reset Email ────────────────────────────────────────
export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #0D9488; }
        .header h1 { color: #0D9488; margin: 0; font-size: 28px; }
        .content { padding: 30px 20px; }
        .content p { color: #374151; line-height: 1.6; font-size: 16px; }
        .button { display: inline-block; padding: 14px 30px; background: linear-gradient(135deg, #0D9488, #F59E0B); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 14px; }
        .footer a { color: #0D9488; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌍 AI Tour Rwanda</h1>
        </div>
        <div class="content">
          <h2 style="color: #374151;">Reset Your Password</h2>
          <p>Hi <strong>${user.name || 'there'}</strong>,</p>
          <p>We received a request to reset your password for your <span style="color: #0D9488; font-weight: bold;">AI Tour Rwanda</span> account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          <p style="font-size: 14px; color: #6b7280;">This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} AI Tour Rwanda. All rights reserved.</p>
          <p>Kigali, Rwanda 🇷🇼</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Reset Your Password
    
    Hi ${user.name || 'there'},
    
    We received a request to reset your password for your AI Tour Rwanda account.
    
    Click the link below to reset your password:
    ${resetUrl}
    
    This link will expire in 1 hour.
    
    If you didn't request a password reset, you can safely ignore this email.
    
    © ${new Date().getFullYear()} AI Tour Rwanda. All rights reserved.
    Kigali, Rwanda 🇷🇼
  `;

  return sendEmail({
    to: user.email,
    subject: 'Reset Your Password - AI Tour Rwanda',
    html,
    text,
  });
};

export default {
  sendEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
};