import 'dotenv/config';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

// Initialize MailerSend
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY
});

// Helper function to send email notifications
export const sendNotification = async (to, subject, message) => {
  try {
    const sentFrom = new Sender(process.env.FROM_EMAIL, "House Of Peishy");
    const recipients = [new Recipient(to, "Customer")];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(subject)
      .setHtml(`<p>${message}</p>`)
      .setText(message);

    const response = await mailerSend.email.send(emailParams);

    console.log("✅ Email sent:", response);
    return { success: true, data: response };
  } catch (error) {
    console.error("❌ Email error:", error.response?.body || error.message || error);
    return { success: false, error: error.response?.body || error.message || error };
  }
};

// Email Templates
export const emailTemplates = {
  booking: (customerName, service, date, time) =>
    `Hi ${customerName}, your ${service} appointment has been booked for ${date} at ${time}. We'll confirm shortly 💅`,

  confirmation: (customerName, service, date, time) =>
    `Hi ${customerName}, your ${service} appointment is confirmed for ${date} at ${time}. We can’t wait to see you! 💖`,

  reminder: (customerName, service, date, time) =>
    `Reminder 💫: Your ${service} appointment is tomorrow at ${time}. Please reply to confirm or reschedule.`,

  cancellation: (customerName, service, date, time) =>
    `Hi ${customerName}, your ${service} appointment on ${date} at ${time} has been cancelled. You can book again anytime.`
};








const nodemailer = require("nodemailer");

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
// const FRONTEND_URL = process.env.FRONTEND_URL || 'https://houseofpeishy.vercel.app';
//  Create transporter using
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

//  Helper function to send email
const sendEmail = async (to, subject, message) => {
  try {
    const info = await transporter.sendMail({
      from: `"House of Peishy" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: message,
      html: message
    });

    console.log(`✅ Email sent successfully: ${info.messageId}`);
    return { success: true, data: info };
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    return { success: false, error };
  }
};

const emailTemplates = {
  booking: (customerName, serviceId, date) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px;">
        <h2 style="color: #333; margin-top: 0; font-size: 24px;">Booking Confirmation</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Hi <strong>${customerName}</strong>,
        </p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Your appointment has been booked for <strong>${date}</strong>. 💅
        </p>
        <p style="color: #999; font-size: 14px;">We'll confirm shortly.</p>
        <div style="border-top: 1px solid #ddd; margin-top: 20px; padding-top: 20px;">
          <a href="${FRONTEND_URL}/appointments/${serviceId}" style="background-color: #e91e63; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; display: inline-block; font-weight: bold;">View Booking</a>
        </div>
      </div>
    </div>
  `,

  confirmation: (customerName, serviceId, date) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px;">
        <h2 style="color: #333; margin-top: 0; font-size: 24px;">Appointment Confirmed</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Hi <strong>${customerName}</strong>,
        </p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Your appointment is confirmed for <strong>${date}</strong>. 💖
        </p>
        <p style="color: #999; font-size: 14px;">We can't wait to see you!</p>
        <div style="border-top: 1px solid #ddd; margin-top: 20px; padding-top: 20px;">
          <a href="${FRONTEND_URL}/appointments/${serviceId}" style="background-color: #e91e63; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; display: inline-block; font-weight: bold;">View Details</a>
        </div>
      </div>
    </div>
  `,

  reminder: (customerName, serviceId, date) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #fff3e0; border-left: 4px solid #ff9800; border-radius: 4px; padding: 24px;">
        <h2 style="color: #e65100; margin-top: 0; font-size: 20px;">Appointment Reminder 💫</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Hi <strong>${customerName}</strong>,
        </p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Your appointment is tomorrow at <strong>${date}</strong>.
        </p>
        <p style="color: #999; font-size: 14px; margin-bottom: 16px;">Please confirm or reschedule.</p>
        <div style="margin-top: 20px;">
          <a href="${FRONTEND_URL}/appointments/${serviceId}" style="background-color: #ff9800; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">View Details</a>
        </div>
      </div>
    </div>
  `,

  cancellation: (customerName, serviceId, date, time) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #ffebee; border-left: 4px solid #f44336; border-radius: 4px; padding: 24px;">
        <h2 style="color: #c62828; margin-top: 0; font-size: 20px;">Appointment Cancelled</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Hi <strong>${customerName}</strong>,
        </p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Your appointment on <strong>${date}</strong> at <strong>${time}</strong> has been cancelled.
        </p>
        <p style="color: #999; font-size: 14px;">You can book again anytime.</p>
        <div style="border-top: 1px solid #ddd; margin-top: 20px; padding-top: 20px;">
          <a href="${FRONTEND_URL}/book" style="background-color: #333; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; display: inline-block; font-weight: bold;">Book Again</a>
        </div>
      </div>
    </div>
  `,
};

module.exports = { sendEmail, emailTemplates, transporter };
