const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  urls: [String],
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Image", imageSchema);
