import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create transporter using SMTP (cPanel)
const transporter = nodemailer.createTransport({
  host: process.env.CPANEL_MAIL_HOST ,
  port: Number(process.env.CPANEL_MAIL_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.CPANEL_MAIL_USER,
    pass: process.env.CPANEL_MAIL_PASS // your email password
  }
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email transporter is ready");
  }
});

// Helper function to send email
export const sendEmail = async (to, subject, message) => {
  try {
    const info = await transporter.sendMail({
      from: `"House of Peishy" <houseofpeishy@aduvieevents.com>`, // sender
      to,       // recipient email
      subject,  // email subject
      text: message,       // plain text body
      html: `<p>${message}</p>` // HTML body
    });

    console.log("✅ Email sent:", info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("❌ Email sending error:", error);
    return { success: false, error };
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
