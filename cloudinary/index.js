const cloudinary= require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_cloud_name,
    api_key: process.env.CLOUDINARY_cloud_key,
    api_secret: process.env.CLOUDINARY_cloud_secret
})



const storage=new CloudinaryStorage({
    cloudinary,
    params:{
    folder:'LocCamp',
    allowedFormats: ['jpeg', 'png', 'jpg']
    }

});

module.exports={cloudinary,storage};
