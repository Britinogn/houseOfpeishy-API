
// utils/notificationService.js
const axios = require('axios');

const sendNotification = async (to, message, preferredMethod = 'sms') => {
    try {
        let phoneNumber = to.replace(/\s+/g, '');
        if (phoneNumber.startsWith('0')) {
            phoneNumber = '234' + phoneNumber.substring(1);
        } else if (phoneNumber.startsWith('+234')) {
            phoneNumber = phoneNumber.substring(1);
        } else if (!phoneNumber.startsWith('234')) {
            phoneNumber = '234' + phoneNumber;
        }

        // Try WhatsApp first, fallback to SMS
        if (preferredMethod === 'whatsapp') {
            try {
                const whatsappResponse = await axios.post('https://api.ng.termii.com/api/whatsapp/send', {
                    to: phoneNumber,
                    from: process.env.TERMII_SENDER_ID,
                    type: 'whatsapp',
                    channel: 'whatsapp',
                    api_key: process.env.TERMII_API_KEY,
                    data: {
                        message: message
                    }
                });
                console.log('WhatsApp sent:', whatsappResponse.data);
                return { success: true, method: 'whatsapp', data: whatsappResponse.data };
            } catch (whatsappError) {
                console.log('WhatsApp failed, falling back to SMS');
            }
        }

        // Send SMS
        const smsResponse = await axios.post('https://api.ng.termii.com/api/sms/send', {
            to: phoneNumber,
            from: process.env.TERMII_SENDER_ID,
            sms: message,
            type: 'plain',
            channel: 'generic',
            api_key: process.env.TERMII_API_KEY
        });

        console.log('SMS sent:', smsResponse.data);
        return { success: true, method: 'sms', data: smsResponse.data };

    } catch (error) {
        console.error('Notification error:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }

};


// SMS Templates
const smsTemplates = {
    booking: (customerName, service, date, time) => 
        `Hi ${customerName}, your ${service} appointment has been booked for ${date} at ${time}. We'll confirm shortly 💅`,

    confirmation: (customerName, service, date, time) => 
        `Hi ${customerName}, your ${service} appointment is confirmed for ${date} at ${time}. We can’t wait to see you! 💖`,

    reminder: (customerName, service, date, time) => 
        `Reminder 💫: Your ${service} appointment is tomorrow at ${time}. Please reply to confirm or reschedule.`,

    cancellation: (customerName, service, date, time) => 
        `Hi ${customerName}, your ${service} appointment on ${date} at ${time} has been cancelled. You can book again anytime.`
};


module.exports = { sendNotification , smsTemplates};