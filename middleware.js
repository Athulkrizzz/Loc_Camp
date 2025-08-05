const campground=require('./models/CampGround')
const Review=require('./models/review')
const AppError=require('./utils/AppError')
const wrapAsync=require('./utils/wrapAsync')
const {campgroundschema}=require('./campgroundschema');
const { reviewSchema } = require('./campgroundschema');

const joi=require('joi');


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){ 
        req.flash('error','Yoy must be Loggged In first ')
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor=async(req,res,next)=>{
    const {id}=req.params;
    const camp=await campground.findById(id);
    if(!camp.postedBy.equals(req.user._id)){
        req.flash('error','You do not have permission to edit this campground');
        return res.redirect(`/campground/${camp.id}`);
        // return next(new AppError('You do not have permission to edit this campground', 403));
    } 
    next();
  }
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;  // ✅ use correct casing
    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash('error', 'Review not found');
        return res.redirect(`/campground/${id}`);
    }

    if (!review.postedBy.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to delete this review');
        return res.redirect(`/campground/${id}`);
    }

    next();
};


module.exports.validatecampground= ( req,res,next)=>{
    const campgroundschema= joi.object({
        campground: joi.object({
            name: joi.string().required(),
            price: joi.number().required().min(0),
            location: joi.string().required(),
            description: joi.string().required(),
            // image: joi.string().required() // Assuming you want to validate an image URL
        }).required(),
        deleteImages: joi.array(),
    })

    const {error}= campgroundschema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new AppError(msg,400);
    }
    next()
}
module.exports. validateReview= (req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new AppError(msg,400);
    }
    next();
}
