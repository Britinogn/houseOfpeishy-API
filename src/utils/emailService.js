//require("dotenv").config();
const nodemailer = require("nodemailer");

//  Create transporter using cPanel SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // stored in .env
    pass: process.env.EMAIL_PASS // stored in .env
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
  booking: (customerName, service, serviceId,  date) =>
    `Hi ${customerName}, your ${serviceId} appointment has been booked for ${date}. We'll confirm shortly 💅`,

  confirmation: (customerName, serviceId, date) =>
    `Hi ${customerName}, your ${serviceId} appointment is confirmed for ${date} . We can’t wait to see you! 💖`,

  reminder: (customerName, serviceId, date) =>
    `Reminder 💫: Your ${serviceId} appointment is tomorrow at ${date}. Please reply to confirm or reschedule.`,

  cancellation: (customerName, serviceId, date, time) =>
    `Hi ${customerName}, your ${serviceId} appointment on ${date} at ${time} has been cancelled. You can book again anytime.`
};

// ✅ Export for reuse or standalone test
module.exports = { sendEmail, emailTemplates, transporter };

