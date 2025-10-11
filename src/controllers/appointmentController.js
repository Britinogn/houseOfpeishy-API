const Appointment = require('../models/Appointment')
const Service = require('../models/Service')
const { sendEmail , emailTemplates } = require('../utils/emailService');

// sendEmail
exports.createAppointment = async (req, res) => {
    try {
        const { serviceId, appointmentDate, appointmentTime, customerName, customerEmail, customerPhone, notes} = req.body;

        if (!serviceId || !appointmentDate || !appointmentTime || !customerName || !customerEmail || !customerPhone) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const service = await Service.findById(serviceId);
        if (!service) return res.status(404).json({ message: 'Service not found' });
        if (!service.isActive) return res.status(400).json({ message: 'Service is not available for booking' });

        const existingAppointment = await Appointment.findOne({
            serviceId,
            appointmentDate,
            appointmentTime,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (existingAppointment) return res.status(400).json({ message: 'Time slot already booked' });

        const appointment = new Appointment({
            serviceId,
            appointmentDate,
            appointmentTime,
            customerName,
            customerEmail,
            customerPhone,
            notes
        });

        try {
            const message = emailTemplates.booking(
                appointment.customerName,
                appointment.serviceId.name,
                new Date(appointment.appointmentDate).toDateString(),
                appointment.appointmentTime
            );

            const emailResult = await sendEmail(
                appointment.customerEmail,
                "Your Appointment Booking Confirmation 💅",
                message
            );

            // Update appointment if email succeeded
            if (emailResult.success) {
                appointment.emailSent.booking = true;
                await appointment.save();
                console.log("✅ Booking email sent successfully");
            } else {
                console.warn("⚠️ Failed to send booking email:", emailResult.error);
            }
        } catch (err) {
            console.error("❌ Error sending booking email:", err);
        }


        await appointment.save();
        await appointment.populate("serviceId", "name price category duration");

        res.status(201).json({
            message: "Appointment created successfully",
            appointment,
            emailSent: appointment.emailSent.booking,
        });
    } catch (error) {
        console.error("❌ Appointment creation error:", error);
        res.status(500).json({ message: error.message });
    }
};


exports.getAvailableSlots = async(req, res) => {
    try {
        //const { serviceId, date } = req.query;

        const { serviceId } = req.params; // from URL
        const { date } = req.query;       // date still comes as query param

        
        // Validate required parameters
        if (!serviceId || !date) {
            return res.status(400).json({ message: 'Service ID and date are required' });
        }
        
        // Check if service exists
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        
        // Define all possible time slots (customize as needed)
        const allSlots = [
            '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
            '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
            '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
        ];
        
        // Get booked appointments for that date
        const bookedAppointments = await Appointment.find({
            serviceId,
            appointmentDate: new Date(date),
            status: { $in: ['pending', 'confirmed'] }
        }).select('appointmentTime');
        
        // Extract booked times
        const bookedSlots  = bookedAppointments.map(apt => apt.appointmentTime);
        
        // Filter out booked slots
        const availableSlots = allSlots.filter(slot => !bookedSlots .includes(slot));
        
        res.json({
            date,
            service: service.name,
            totalSlots: allSlots.length,
            bookedSlots: bookedSlots .length,
            availableSlots
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.getAllAppointments = async(req, res) => {
    try {
        const { page = 1, limit = 10, status, date } = req.query;
        const skip = (page - 1) * limit;
        
        // Build filter object
        const filter = {};
        if (status) {
            filter.status = status;
        }
        if (date) {
            filter.appointmentDate = new Date(date);
        }
        
        const totalDocuments = await Appointment.countDocuments(filter);
        const totalPages = Math.ceil(totalDocuments / limit);
        
        const appointments = await Appointment.find(filter)
            .populate('serviceId', 'name price category duration')
            .sort({ appointmentDate: 1, appointmentTime: 1 })
            .skip(Number(skip))
            .limit(Number(limit));
        
        res.json({
            totalPages,
            totalDocuments,
            page: Number(page),
            limit: Number(limit),
            appointments
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    //  Validate status
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status. Must be: pending, confirmed, completed, or cancelled'
      });
    }

    //  Find appointment and populate service details
    const appointment = await Appointment.findById(id).populate('serviceId', 'name');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const oldStatus = appointment.status;
    appointment.status = status;

    //  Prepare SMS message
    const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    let emailResult = { success: false };

    //  Send SMS based on status change
    if (status === 'confirmed') {
      const message = emailTemplates.confirmation(
        appointment.customerName,
        appointment.serviceId.name,
        formattedDate,
        appointment.appointmentTime
      );

        emailResult = await sendEmail(
            appointment.customerEmail, 
            'Your Appointment Booking has been confirmed ',
            message
        );

      if (emailResult.success) appointment.emailSent.confirmation = true;
    }

    if (status === 'cancelled') {
        const message = emailTemplates.cancellation(
            appointment.customerName,
            appointment.serviceId.name,
            formattedDate,
            appointment.appointmentTime
        );

        emailResult = await sendEmail(
            appointment.customerEmail, 
            'Your Appointment Booking has been cancelled ',
            message
        );
      
        if (emailResult.success) appointment.emailSent.cancellation = true;
    }

    //  Save updates
    await appointment.save();

    //  Response
    res.json({
      message: `Appointment status updated to ${status}`,
      appointment,
      emailSent: emailResult.success
    });
  } catch (error) {
    console.error('❌ Error updating appointment status:', error.message);
    res.status(500).json({ message: error.message });
  }
};



exports.sendReminder = async(req, res) => {
    try {
        const { id } = req.params;
        
        const appointment = await Appointment.findById(id).populate('serviceId');
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        
        if (appointment.status !== 'confirmed') {
            return res.status(400).json({ message: 'Can only send reminders for confirmed appointments' });
        }
        
        const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
        
        const message = emailTemplates.reminder(
            appointment.customerName,
            appointment.serviceId.name,
            formattedDate,
            appointment.appointmentTime
        );
        
        const emailResult = await sendEmail(appointment.customerEmail, message);
        
        if (emailResult.success) {
            appointment.emailSent.reminder = true;
            await appointment.save();
        }
        
        res.json({
            message: 'Reminder sent successfully',
            emailSent: emailResult.success
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.getAppointmentById = async( req, res ) =>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// exports.updateStatus = async( req, res ) =>{
//     try {
        
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

exports.deleteAppointment = async( req, res ) =>{
    try {
        const { id } = req.params;

        const appointment = await Appointment.findByIdAndDelete(id);

        if (!appointment) {
            return res.status(404).json({ 
                message: 'Appointment schedule not found' 
            });
        }

        res.status(200).json({ 
            message: `Appointment has been deleted successfully` 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getAppointmentsByDate = async( req, res ) =>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getAppointmentsByStatus = async( req, res ) =>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}




