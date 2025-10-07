const Availability = require ('../models/Availability')
const moment = require ('moment')

// Get full week schedule
exports.getWeekSchedule = async(req, res) => {
    try {
        const weekSchedule = await Availability.find().sort({ createdAt: 1 });

        if (!weekSchedule || weekSchedule.length === 0) {
            return res.status(404).json({ 
                message: 'No weekly schedule has been set up yet. Please configure your business hours.' 
            });
        }

        res.status(200).json({ 
            message: 'Weekly schedule retrieved successfully',
            schedule: weekSchedule 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get schedule for specific day
exports.getDaySchedule = async(req, res) => {
    try {
        const { day } = req.params;
        
        // Validate day name
        const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        if (!validDays.includes(day)) {
            return res.status(400).json({ 
                message: `Invalid day name. Please use: ${validDays.join(', ')}` 
            });
        }

        const schedule = await Availability.findOne({ dayOfWeek: day });

        if (!schedule) {
            return res.status(404).json({ 
                message: `No schedule found for ${day}.` 
            });
        }

        res.status(200).json({ 
            message: `${day} schedule retrieved successfully`,
            schedule 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Check if business is open on a specific date
exports.checkIfOpen = async(req, res) => {
    try {
        const { date } = req.query;
        
        if (!date) {
            return res.status(400).json({ 
                message: 'Date is required. Format: YYYY-MM-DD' 
            });
        }

        // Validate date format
        if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
            return res.status(400).json({ 
                message: 'Invalid date format. Please use YYYY-MM-DD (e.g., 2025-11-20)' 
            });
        }

        const dayName = moment(date).format('dddd');
        const availability = await Availability.findOne({ dayOfWeek: dayName });

        if (!availability) {
            return res.status(404).json({ 
                isOpen: false,
                message: `No availability schedule found for ${dayName}. Please contact us to check.` 
            });
        }

        if (availability.isClosed) {
            return res.status(200).json({ 
                isOpen: false,
                day: dayName,
                message: `We are closed on ${dayName}s. Please choose another day.` 
            });
        }

        res.status(200).json({
            isOpen: true,
            day: dayName,
            date: date,
            openTime: availability.openTime,
            closeTime: availability.closeTime,
            slotDuration: availability.slotDuration || 30,
            bufferTime: availability.bufferTime || 0,
            message: `We are open on ${dayName} from ${availability.openTime} to ${availability.closeTime}`
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Set availability for a day
exports.setAvailability = async(req, res) => {
    try {
        const { dayOfWeek, openTime, closeTime, isClosed, slotDuration, bufferTime } = req.body;

        // Validate required fields
        if (!dayOfWeek) {
            return res.status(400).json({ 
                message: 'Day of week is required (e.g., Monday, Tuesday, etc.)' 
            });
        }

        if (!isClosed && (!openTime || !closeTime)) {
            return res.status(400).json({ 
                message: 'Open time and close time are required when the day is not marked as closed' 
            });
        }

        // Validate day name
        const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        if (!validDays.includes(dayOfWeek)) {
            return res.status(400).json({ 
                message: `Invalid day name. Please use: ${validDays.join(', ')}` 
            });
        }

        // Check if schedule already exists - FIXED LOGIC
        const existing = await Availability.findOne({ dayOfWeek });
        if (existing) {
            return res.status(400).json({ 
                message: `A schedule for ${dayOfWeek} already exists.` 
            });
        }

        const availability = new Availability({
            dayOfWeek,
            openTime: isClosed ? null : openTime,
            closeTime: isClosed ? null : closeTime,
            isClosed: isClosed || false,
            slotDuration: slotDuration || 30,
            bufferTime: bufferTime || 0
        });

        await availability.save();
        
        res.status(201).json({ 
            message: `Availability for ${dayOfWeek} has been set successfully`,
            availability 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update availability for a day
exports.updateAvailability = async(req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Validate day name if being updated
        if (updates.dayOfWeek) {
            const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            if (!validDays.includes(updates.dayOfWeek)) {
                return res.status(400).json({ 
                    message: `Invalid day name. Please use: ${validDays.join(', ')}` 
                });
            }
        }

        // If marking as closed, clear times
        if (updates.isClosed === true) {
            updates.openTime = null;
            updates.closeTime = null;
        }

        // If marking as open, ensure times are provided
        if (updates.isClosed === false && (!updates.openTime || !updates.closeTime)) {
            return res.status(400).json({ 
                message: 'Open time and close time are required when marking a day as open' 
            });
        }

        const availability = await Availability.findByIdAndUpdate(
            id, 
            updates, 
            { new: true, runValidators: true }
        );

        if (!availability) {
            return res.status(404).json({ 
                message: 'Availability schedule not found. Please check the ID and try again.' 
            });
        }

        res.status(200).json({ 
            message: `Availability for ${availability.dayOfWeek} has been updated successfully`,
            availability 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Delete availability (bonus endpoint)
exports.deleteAvailability = async(req, res) => {
    try {
        const { id } = req.params;

        const availability = await Availability.findByIdAndDelete(id);

        if (!availability) {
            return res.status(404).json({ 
                message: 'Availability schedule not found' 
            });
        }

        res.status(200).json({ 
            message: `Availability for ${availability.dayOfWeek} has been deleted successfully` 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}