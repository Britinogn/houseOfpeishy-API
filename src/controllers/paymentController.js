const Payment = require ('../utils/paymentHelper')


exports.recordPayment = async( req, res ) =>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getAllPayments = async( req, res ) =>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.getPaymentById = async( req, res ) =>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getPaymentByAppointment = async( req, res ) =>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updatePayment = async( req, res ) =>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getPaymentSummary = async( req, res ) =>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const { initiatePaystackPayment, verifyPaystackPayment } = require('../utils/paymentHelper');

exports.createPayment = async (req, res) => {
  const { email, amount } = req.body;

  const reference = `PAY-${Date.now()}`;
  const result = await initiatePaystackPayment(email, amount, reference);

  if (!result.success) {
    return res.status(400).json({ message: 'Payment initiation failed', error: result.error });
  }

  res.status(200).json({
    message: 'Payment initiated successfully',
    authorization_url: result.data.authorization_url,
    reference: result.data.reference,
  });
};
