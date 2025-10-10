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
