// controllers/adminDashboardController.js
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Gallery = require('../models/Gallery');
const Admin = require('../models/Admin'); // Optional if you have customers

exports.getDashboardStats = async (req, res) => {
  try {
    
    const admin = req.admin;

    // const totalAppointments = await Appointment.countDocuments();
    // const totalServices = await Service.countDocuments();
    // const totalGalleryItems = await Gallery.countDocuments();
    //const totalCustomers = await Admin.countDocuments();
     const [totalAppointments, totalServices, totalGalleryItems, totalAdmins] = await Promise.all([
      Appointment.countDocuments(),
      Service.countDocuments(),
      Gallery.countDocuments(),
      Admin.countDocuments()
    ]);

    // Count recent 7 days bookings
    const recentAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('serviceId', 'name price category')

    // Basic revenue calculation (if payment stored)
    const totalRevenue = await Appointment.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: "$amountPaid" } } }
    ]);

    res.status(200).json({
      message: `Welcome, ${admin.username}`,
      data: {
        totalAppointments,
        totalServices,
        totalGalleryItems,
        totalAdmins  ,
        recentAppointments,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
