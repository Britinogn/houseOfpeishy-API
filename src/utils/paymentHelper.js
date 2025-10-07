const axios = require('axios');

// ---------- PAYSTACK ----------
const paystackBaseURL = 'https://api.paystack.co';

const initiatePaystackPayment = async (email, amount, reference) => {
  try {
    const response = await axios.post(
      `${paystackBaseURL}/transaction/initialize`,
      {
        email,
        amount: amount * 100, // Convert to kobo
        reference,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('Paystack init error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

const verifyPaystackPayment = async (reference) => {
  try {
    const response = await axios.get(
      `${paystackBaseURL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('Paystack verify error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// ---------- FLUTTERWAVE ----------
const flutterBaseURL = 'https://api.flutterwave.com/v3';

const initiateFlutterPayment = async (payload) => {
  try {
    const response = await axios.post(
      `${flutterBaseURL}/payments`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    );

    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('Flutterwave init error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

const verifyFlutterPayment = async (transactionId) => {
  try {
    const response = await axios.get(
      `${flutterBaseURL}/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    );

    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('Flutterwave verify error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Export helpers
module.exports = {
  initiatePaystackPayment,
  verifyPaystackPayment,
  initiateFlutterPayment,
  verifyFlutterPayment,
};
