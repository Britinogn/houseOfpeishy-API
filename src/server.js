require ('dotenv').config();

const connectDB = require('./config/database')
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
const cors = require('cors'); 

// Import routes
const authRoutes = require('./routes/authRoute');
const serviceRoutes = require('./routes/serviceRoute');
const appointmentRoutes = require('./routes/appointmentRoute');
const paymentRoutes = require('./routes/paymentRoute');
const galleryRoutes = require('./routes/galleryRoute');
const availabilityRoutes = require('./routes/availabilityRoute');
const adminDashboardRoute = require('./routes/adminDashboardRoute')

//connectDB 
connectDB();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['https://houseofpeishy.vercel.app', 'http://localhost:5173'],
  credentials: true,
}));

app.use(express.urlencoded({ extended: true })); 


// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/availability', availabilityRoutes);

app.use('/api/admin', adminDashboardRoute );



// Basic test route
app.get('/', (req, res) => {
    res.json({ message: 'House of Peishy API is running!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
app.listen(PORT, () => console.log( ` 🚀 Server running on port ${PORT}`));








