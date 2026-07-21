// backend/src/config/services/emailService.js
// ✅ OPTIMIZED - Async email with queue support

import nodemailer from "nodemailer";

let transporter = null;
let etherealAccount = null;
let emailQueue = [];
let isProcessingQueue = false;

/**
 * Create or get transporter with fallback to Ethereal
 */
const getTransporter = async () => {
  if (transporter) return transporter;

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
        tls: {
          rejectUnauthorized: false,
        },
      });

      await transporter.verify();
      console.log("✅ Email transporter ready (Gmail/Configured)");
      return transporter;
    } catch (error) {
      console.warn("⚠️ Configured email failed:", error.message);
      console.log("🔄 Falling back to Ethereal...");
    }
  }

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
 * Process email queue
 */
const processEmailQueue = async () => {
  if (isProcessingQueue || emailQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (emailQueue.length > 0) {
    const { to, subject, html, resolve, reject } = emailQueue.shift();
    
    try {
      const result = await sendEmailSync(to, subject, html);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  }
  
  isProcessingQueue = false;
};

/**
 * Send email synchronously (internal)
 */
const sendEmailSync = async (to, subject, html) => {
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

  if (etherealAccount && info.messageId) {
    console.log(`   🔗 Preview: https://ethereal.email/message/${info.messageId}`);
  }

  return { success: true, messageId: info.messageId };
};

/**
 * Send email - Non-blocking (queued)
 * ✅ This is the main export - always returns immediately
 */
const sendEmail = async (to, subject, html) => {
  // ✅ Return a promise that will be resolved later
  return new Promise((resolve, reject) => {
    // ✅ Add to queue and process
    emailQueue.push({ to, subject, html, resolve, reject });
    
    // ✅ Process queue asynchronously
    setImmediate(() => processEmailQueue());
  });
};

/**
 * Check if email is configured
 */
const isEmailConfigured = () => {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);
};

/**
 * Get queue size
 */
const getQueueSize = () => {
  return emailQueue.length;
};

export default sendEmail;
export { getTransporter, isEmailConfigured, getQueueSize };