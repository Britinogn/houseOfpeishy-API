const Service = require ('../models/Service')
const Cloudinary =require ('../config/cloudinary')

exports.getAllServices = async(req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        
        const totalDocuments = await Service.countDocuments();
        const totalPages = Math.ceil(totalDocuments / limit);
        
        const services = await Service.find()
            //.populate('admin', 'username')
            .sort({ createdAt: -1 })
            .skip(Number(skip))
            .limit(Number(limit));
        
        res.json({ 
            totalPages, 
            totalDocuments,
            page: Number(page), 
            limit: Number(limit), 
            services 
        });
    
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getServiceById = async(req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid service ID.' });
        }

        // Find service by ID
        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({ message: 'Service not found.' });
        }

        res.status(200).json({
            message: 'Service retrieved successfully.',
            service
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve service.',
            error: error.message
        });
    }
}


exports.getServicesByCategory = async(req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        
        // Validate category
        const validCategories = ['Beauty Treatment', 'Braid Style', 'Hair Styling', 'Wig Making', 'Hair Sales'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ message: 'Invalid category' });
        }
        
        const totalDocuments = await Service.countDocuments({ category });
        const totalPages = Math.ceil(totalDocuments / limit);
        
        const services = await Service.find({ category })
            .sort({ createdAt: -1 })
            .skip(Number(skip))
            .limit(Number(limit));
        
        res.json({
            totalPages,
            totalDocuments,
            page: Number(page),
            limit: Number(limit),
            category,
            services
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.createService = async( req, res ) =>{
    try {
        const {name, description, category, price} = req.body;
        if (!name|| !description|| !category|| price === undefined) {
            return res.status(400).json({
                message: 'All required fields (name, description, category, and price) must be provided.'
            })
        }

        //create services
        const service = await Service.create({
            name, 
            description, 
            category, 
            price , 
        });

        //handle image upload if present
        if (req.file && req.file.path) {
            service.coverImage  = {
                url: req.file.path, 
                public_id: req.file.filename
            }

            await service.save();
        };

        res.status(201).json({
            message: 'Service created successfully!',
            service
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to create service.',
            error: error.message,});
    }
}

exports.updateService = async( req, res ) =>{
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: 'Service not found' });
        
        const { name, description, category, price, duration, stockQuantity, isProduct, isActive } = req.body;
        
        service.name = name ?? service.name;   
        service.description = description ?? service.description;
        service.category = category ?? service.category;
        service.price = price ?? service.price;
        service.duration = duration ?? service.duration;
        service.stockQuantity = stockQuantity ?? service.stockQuantity;
        service.isProduct = isProduct ?? service.isProduct;
        service.isActive = isActive ?? service.isActive;

        if (req.file && req.file.path) {
            service.coverImage = { url: req.file.path, public_id: req.file.filename };
        }

        await service.save();
        res.json({ message: 'Service updated successfully', service });
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.deleteService = async( req, res ) =>{
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: 'Service not found' });
        
        // Cloudinary deletion if present
        if (service.coverImage && service.coverImage.public_id) {
            try {
                await Cloudinary.uploader.destroy(service.coverImage.public_id);
            } catch (e) {
                console.error('Cloudinary deletion error', e);
            }
        }
        
        await Service.findByIdAndDelete(req.params.id);
        
        return res.json({ message: 'Service deleted successfully' });
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
}

exports.toggleServiceStatus = async( req, res ) =>{
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: 'Service not found' });
        
        service.isActive = !service.isActive;
        await service.save();
        
        res.json({ 
            message: `Service ${service.isActive ? 'activated' : 'deactivated'} successfully`, 
            service 
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
