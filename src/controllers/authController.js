const Admin = require ('../models/Admin');
const bcrypt = require ('bcryptjs')
const jwt = require('jsonwebtoken')



exports.register = async( req, res ) =>{
    try {
        const {username , email , password, role = 'owner'} = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({message: 'All fields are required'})
        }

        if (!['owner' ,'manager' ,'receptionist', 'stylist'].includes(role) ){
            return res.status(400).json({message: 'Invalid role'})
        }

        const existingAdmin = await Admin.findOne({$or: [{email}, {username}]});
        if (existingAdmin) {
            return res.status(400).json({message: 'Admin already exist'})
        }

        const hashedPassword = await bcrypt.hash(password, 15);
        const admin = await Admin.create({username, email , password: hashedPassword, role});

        //JWT 
        const token = jwt.sign(
            {id: admin._id, role: admin.role},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || '2h'}
        )

        res.status(201).json({
            id: admin._id,
            username: admin.username,
            email: admin.email ,
            role: admin.role,
            token,
        })


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.login = async( req, res ) =>{
    try {
        const {username, email, password} = req.body;
        if (!username && !email || !password ){
            return res.status(400).json({ message: 'Please provide your username or email, and your password to continue.' });
        }

        const admin = await Admin.findOne({$or: [{email}, {username}]})
        if (!admin) {
            return res.status(400).json({ message: 'Invalid username or email. Please check your credentials and try again.' });
        }

        const isMatch = await bcrypt.compare(password, admin.password)
        if(!isMatch) return res.status(400).json({ message: 'Incorrect password. Please try again.' });

        //access token 
        const token = jwt.sign(
            {id: admin._id, role: admin.role},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || '2h'}
        )

        res.status(201).json({
            message: 'Login successful.',
            id: admin._id,
            role: admin.role,
            token,
        });



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.logout = async( req, res ) =>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getProfile = async (req, res) => {
    try {
        // `req.admin` is already attached by authMiddleware
        const admin = req.admin;

        res.status(200).json({
            message: 'Profile fetched successfully.',
            profile: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
                createdAt: admin.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profile.', error: error.message });
    }
};


exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new passwords are required.' });
        }

        const admin = req.admin;

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect.' });
        }

        // Hash and update new password
        const hashed = await bcrypt.hash(newPassword, 15);
        admin.password = hashed;
        await admin.save();

        res.status(200).json({ message: 'Password updated successfully.' });

    } catch (error) {
        res.status(500).json({ message: 'Failed to update password.', error: error.message });
    }
};
