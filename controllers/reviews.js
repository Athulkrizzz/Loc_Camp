const campground=require('../models/CampGround')
const Review=require('../models/review')



// module.exports.reviewPost=async(req,res,next)=>{
//     const camp=await campground.findById (req.params.id);
//     if(!camp){
//         return next(new AppError('Campground Not Found',404));
//     }
//     const review=new Review(req.body.review);
//     review.postedBy=req.user._id; // Assuming you want to associate the review with the logged-in user
//     camp.reviews.push(review);
//     await review.save();
//     await camp.save();
//     req.flash('success','Successfully created the review');
//     res.redirect(`/campground/${camp._id}`);
// }
module.exports.reviewPost = async (req, res, next) => {
  const camp = await campground.findById(req.params.id);
  if (!camp) {
    return next(new AppError('Campground Not Found', 404));
  }

  const review = new Review(req.body.review);
  review.postedBy = req.user._id;
  await review.save();

  // ✅ Avoid full validation by updating only the reviews array
  await campground.findByIdAndUpdate(req.params.id, {
    $push: { reviews: review._id }
  });

  req.flash('success', 'Successfully created the review');
  res.redirect(`/campground/${camp._id}`);
};

module.exports.reviewDelete = async (req, res, next) => {
  const { id, reviewId } = req.params;

  const camp = await campground.findById(id);
  if (!camp) {
    return next(new AppError('Campground Not Found', 404));
  }

  await Review.findByIdAndDelete(reviewId);

  // ✅ Use $pull to safely remove review from array without triggering validation
  await campground.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId }
  });

  req.flash('success', 'Successfully deleted the review');
  res.redirect(`/campground/${camp._id}`);
};

// module.exports.reviewDelete=async(req,res,next)=>{
//     const {id,reviewId}=req.params;
//     const camp=await campground.findById(id);
//     if(!camp){
//         return next(new AppError('Campground Not Found',404));
//     }
//     await Review.findByIdAndDelete(reviewId);
//     camp.reviews=camp.reviews.filter(r=>r._id.toString()!==reviewId);
//     await camp.save();
//     req.flash('success','Successfully deleted the review');
//     res.redirect(`/campground/${camp._id}`);
// }