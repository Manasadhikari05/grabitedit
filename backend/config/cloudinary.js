const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dk65ixtok',
  api_key: '919118157953221',
  api_secret: '37pP7bEa2wrOImQPfKokAjPZjic'
});

module.exports = cloudinary;

