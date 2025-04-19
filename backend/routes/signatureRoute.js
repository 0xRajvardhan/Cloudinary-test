// backend/routes/signatureRoute.js
const express = require('express');
const router = express.Router();
const cloudinary = require('../cloudinary');

router.get('/signature', (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = 'uploads'; // or dynamic based on req.query

  const paramsToSign = {
    timestamp,
    folder,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    cloudinary.config().api_secret
  );

  res.json({
    signature,
    timestamp,
    apiKey: cloudinary.config().api_key,
    cloudName: cloudinary.config().cloud_name,
    folder,
  });
});

module.exports = router;
