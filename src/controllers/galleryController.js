const Gallery = require ('../models/Gallery')


exports.getAllMedia = async (req, res) => {
    try {
        const { category, mediaType } = req.query;
        const filter = {};
        
        if (category) filter.category = category;
        if (mediaType) filter.mediaType = mediaType;

        const media = await Gallery.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Media fetched successfully',
            count: media.length,
            data: media
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMediaByCategory = async( req, res ) =>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.getMediaById = async( req, res ) =>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.uploadMedia = async (req, res) => {
    try {
        const { category, caption } = req.body;

        if (!category) {
            return res.status(400).json({ message: 'Category is required' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const uploadedMedia = [];

        for (const file of req.files) {
            const isVideo = file.mimetype.startsWith('video/');
            const mediaType = isVideo ? 'video' : 'image';

            const newMedia = new Gallery({
                mediaType,
                category,
                caption: caption || ''
            });

            if (mediaType === 'image') {
                newMedia.coverImage = {
                    url: file.path,
                    public_id: file.filename
                };
            } else {
                newMedia.video = {
                    url: file.path,
                    public_id: file.filename,
                    duration: file.duration || null
                };
            }

            await newMedia.save();
            uploadedMedia.push(newMedia);
        }

        res.status(201).json({
            message: `${uploadedMedia.length} file(s) uploaded successfully`,
            media: uploadedMedia
        });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteMedia = async( req, res ) =>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateCaption = async( req, res ) =>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}