if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}




const express= require('express');
const app=express();
const router=express.Router();
const AppError=require('../utils/AppError')
const wrapAsync=require('../utils/wrapAsync')
const campground=require('../models/CampGround')
const joi=require('joi');
const { campgroundschema } = require('../campgroundschema');
const {isLoggedIn,isAuthor,validatecampground}= require('../middleware');
const campgrounds=require('../controllers/campgrounds');
const {storage} = require('../cloudinary/index');
const multer = require('multer');
const upload = multer({storage});





router.get('/camp',campgrounds.getCamp);

router.get('/new',isLoggedIn,campgrounds.showNewForm);


router.post('/',isLoggedIn,upload.array('image'),validatecampground,wrapAsync(campgrounds.createCamp));
// router.post('/',upload.single('image'),async(req,res)=>{
//     res.send({ body: req.body, file: req.file });
// })

router.get('/:id',isLoggedIn ,wrapAsync(campgrounds.selectCamp));





router.get('/:id/edit',isLoggedIn,isAuthor,wrapAsync(campgrounds.editCamp))

router.put('/:id',isLoggedIn,isAuthor,upload.array('image'),wrapAsync(campgrounds.updateCamp))


router.delete('/:id',isLoggedIn,wrapAsync(campgrounds.deleteCamp))

module.exports = router;