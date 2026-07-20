// backend/src/config/services/emailService.js
// ✅ UPDATED - Better error handling, Ethereal fallback, and App Password support

import nodemailer from "nodemailer";

let transporter = null;
let etherealAccount = null;

/**
 * Create or get transporter with fallback to Ethereal
 */
const getTransporter = async () => {
  // Return existing transporter if already created
  if (transporter) return transporter;

  // ─── Option 1: Use configured SMTP (Gmail, SendGrid, etc.) ───
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    try {
      transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || "gmail",
        host: process.env.EMAIL_HOST || undefined,
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_PORT === "465",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        // ✅ Required for Gmail App Password
        tls: {
          rejectUnauthorized: false,
        },
      });

      // ✅ Verify connection
      await transporter.verify();
      console.log("✅ Email transporter ready (Gmail/Configured)");
      return transporter;
    } catch (error) {
      console.warn("⚠️ Configured email failed:", error.message);
      console.log("🔄 Falling back to Ethereal...");
    }
  }

  // ─── Option 2: Use Ethereal Email (Free Test Email) ──────────
  try {
    const { createTestAccount } = await import("nodemailer");
    const testAccount = await createTestAccount();

    etherealAccount = testAccount;

    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    await transporter.verify();

    console.log("📧 ✅ Ethereal email transporter ready");
    console.log(`   📧 Email: ${testAccount.user}`);
    console.log(`   🔑 Password: ${testAccount.pass}`);
    console.log(`   🔗 Preview: https://ethereal.email/login`);

    return transporter;
  } catch (error) {
    console.error("❌ Email transporter failed:", error.message);
    return null;
  }
};

/**
 * Send email with fallback
 */
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = await getTransporter();

    if (!transporter) {
      console.warn(`⚠️ No email transporter available. Would send to: ${to}`);
      console.log(`   Subject: ${subject}`);
      console.log(`   HTML: ${html?.substring(0, 100)}...`);
      return { success: false, fallback: true };
    }

    const from = process.env.EMAIL_FROM || `"AI Tour Rwanda" <${process.env.EMAIL_USER || "noreply@aitour.rw"}>`;

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log(`📧 Email sent to: ${to}`);
    console.log(`   Message ID: ${info.messageId}`);

    // ✅ Log Ethereal preview URL if using test account
    if (etherealAccount && info.messageId) {
      console.log(`   🔗 Preview: https://ethereal.email/message/${info.messageId}`);
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email error:", error.message);
    console.log(`   📧 Would have sent to: ${to}`);
    console.log(`   📝 Subject: ${subject}`);
    return { success: false, error: error.message };
  }
};

/**
 * Check if email is configured
 */
const isEmailConfigured = () => {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);
};

export default sendEmail;
export { getTransporter, isEmailConfigured };