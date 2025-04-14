
const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const Image = require('../models/Image');

// Route to generate pre-signed URL from Cloudinary
router.post('/upload-url', async (req, res) => {
  try {
    const { imageType } = req.body;
    
    // Validate request
    if (!imageType) {
      return res.status(400).json({ message: 'Image type is required' });
    }

    // Generate a timestamp and signature for Cloudinary
    const timestamp = Math.round((new Date).getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request({
      timestamp: timestamp,
      folder: 'image_vault'
    }, process.env.CLOUDINARY_API_SECRET);

    // Return the necessary data for frontend to upload directly to Cloudinary
    return res.status(200).json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: 'image_vault'
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return res.status(500).json({ message: 'Server error generating upload URL' });
  }
});

// Route to save image data after successful upload to Cloudinary
router.post('/save', async (req, res) => {
  try {
    const { cloudinaryUrl, publicId, imageType } = req.body;

    // Validate request
    if (!cloudinaryUrl || !publicId || !imageType) {
      return res.status(400).json({ 
        message: 'Cloudinary URL, public ID, and image type are required' 
      });
    }

    // Create a new image document
    const newImage = new Image({
      cloudinaryUrl,
      publicId,
      imageType
    });

    // Save to MongoDB
    await newImage.save();

    return res.status(201).json({ 
      message: 'Image saved successfully',
      image: newImage 
    });
  } catch (error) {
    console.error('Error saving image:', error);
    return res.status(500).json({ message: 'Server error saving image' });
  }
});

// Route to get all saved images
router.get('/', async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    return res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return res.status(500).json({ message: 'Server error fetching images' });
  }
});

module.exports = router;
