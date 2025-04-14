
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  cloudinaryUrl: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  imageType: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Image', imageSchema);
