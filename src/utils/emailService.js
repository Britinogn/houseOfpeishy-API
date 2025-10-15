//require("dotenv").config();
const nodemailer = require("nodemailer");
const { ResendTransport } = require('resend');

//  Create transporter using cPanel SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // stored in .env
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    apiKey: process.env.RESEND_API_KEY, 
  },

});

//  Helper function to send email
const sendEmail = async (to, subject, message) => {
  try {
    const info = await transporter.sendMail({
      from: `"House of Peishy" <${process.env.EMAIL_USER}>`, // from .env
      to, // recipient
      subject,
      text: message,
      html: `<p>${message}</p>`
    });

    console.log(`✅ Email sent successfully: ${info.messageId}`);
    return { success: true, data: info };
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    return { success: false, error };
  }
};

// ✅ Email Templates
const emailTemplates = {
  booking: (customerName, serviceId, date) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px;">
        <h2 style="color: #333; margin-top: 0; font-size: 24px;">Booking Confirmation</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Hi <strong>${customerName}</strong>,
        </p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Your <strong>${serviceId}</strong> appointment has been booked for <strong>${date}</strong>. 💅
        </p>
        <p style="color: #999; font-size: 14px;">We'll confirm shortly.</p>
        <div style="border-top: 1px solid #ddd; margin-top: 20px; padding-top: 20px;">
          <a href="#" style="background-color: #e91e63; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; display: inline-block; font-weight: bold;">View Booking</a>
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
          Your <strong>${serviceId}</strong> appointment is confirmed for <strong>${date}</strong>. 💖
        </p>
        <p style="color: #999; font-size: 14px;">We can't wait to see you!</p>
        <div style="border-top: 1px solid #ddd; margin-top: 20px; padding-top: 20px;">
          <a href="#" style="background-color: #e91e63; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; display: inline-block; font-weight: bold;">Add to Calendar</a>
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
          Your <strong>${serviceId}</strong> appointment is tomorrow at <strong>${date}</strong>.
        </p>
        <p style="color: #999; font-size: 14px; margin-bottom: 16px;">Please reply to confirm or reschedule.</p>
        <div style="display: flex; gap: 12px;">
          <a href="#" style="background-color: #ff9800; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 14px;">Confirm</a>
          <a href="#" style="background-color: #ccc; color: #333; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 14px;">Reschedule</a>
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
          Your <strong>${serviceId}</strong> appointment on <strong>${date}</strong> at <strong>${time}</strong> has been cancelled.
        </p>
        <p style="color: #999; font-size: 14px;">You can book again anytime.</p>
        <div style="border-top: 1px solid #ddd; margin-top: 20px; padding-top: 20px;">
          <a href="#" style="background-color: #333; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; display: inline-block; font-weight: bold;">Book Again</a>
        </div>
      </div>
    </div>
  `,
};

// ✅ Export for reuse or standalone test
module.exports = { sendEmail, emailTemplates, transporter };

