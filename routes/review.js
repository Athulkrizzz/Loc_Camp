const express = require('express');
const router=express.Router({mergeParams: true});
const AppError=require('../utils/AppError')
const wrapAsync=require('../utils/wrapAsync')
const campground=require('../models/CampGround')
const Review=require('../models/review')
const joi=require('joi');
const { reviewSchema } = require('../campgroundschema');
const { isLoggedIn,validateReview, isReviewAuthor } = require('../middleware');
const reviews=require('../controllers/reviews');
// 
router.post('/',isLoggedIn,validateReview,wrapAsync(reviews.reviewPost));
// router.post('/', validateReview, wrapAsync(async(req,res,next)=>{
//     const camp = await campground.findById(req.params.id);
//     if (!camp) {
//         return next(new AppError('Campground Not Found',404));
//     }
//     console.log("Campground found:", camp);

//     const review = new Review(req.body.review);
//     console.log("New Review:", review);

//     camp.reviews.push(review);
//     await review.save();
//     await camp.save();

//     console.log("Review saved and pushed to campground.");

//     res.redirect(`/campground/${camp._id}`);
// }));
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, wrapAsync(reviews.reviewDelete));

module.exports=router;