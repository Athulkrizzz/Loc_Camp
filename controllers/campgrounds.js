const campground=require('../models/CampGround')
const { cloudinary } = require('../cloudinary');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
module.exports.getCamp=async(req,res)=>{
    const campgrounds=await campground.find({})

    res.render('campground/index',{campgrounds})
}

module.exports.showNewForm=async(req,res)=>{
    res.render('campground/new')
}

// module.exports.createCamp=async (req, res,next) => {

// //         const geoData=await maptilerClient.geocoding.forward(
// //             req.body.campground.location,{limit:1}
// //         )
// //         const camp = new campground(req.body.campground);
// //         camp.geometry=geoData.features[0].geometry; 
// //         camp.geometry = {
// //   type: 'Point',
// //   coordinates: geoData.features[0].geometry.coordinates
// // };
// //         camp.images= req.files.map(f =>({url:f.path,filename:f.filename}))
// //         camp.postedBy = req.user._id; 
// //         console.log(camp);
// //         await camp.save();
// //         req.flash('success','Successfully created the campground') 
// //         res.redirect('/campground/camp');
// //         console.log(camp)
// const geoData = await maptilerClient.geocoding.forward(
//   req.body.campground.location,
//   { limit: 1 }
// );

// // Safely check if features and geometry exist
// if (!geoData || !geoData.features || geoData.features.length === 0) {
//   req.flash('error', 'Location not found');
//   return res.redirect('/campground/new');
// }

// const coordinates = geoData.features[0].geometry.coordinates;

// const camp = new campground(req.body.campground);

// // ✅ Explicitly set `type: 'Point'` as required by schema
// camp.geometry = {
//   type: 'Point',
//   coordinates: coordinates
// };

// camp.images = req.files.map(f => ({
//   url: f.path,
//   filename: f.filename
// }));

// camp.postedBy = req.user._id;
// await camp.save();

// req.flash('success', 'Successfully created the campground');
// res.redirect(`/campground/${camp._id}`);

// }
module.exports.createCamp = async (req, res, next) => {
  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );

  if (!geoData || !geoData.features || geoData.features.length === 0) {
    req.flash('error', 'Location not found');
    return res.redirect('/campground/new');
  }

  const geometry = {
    type: 'Point',
    coordinates: geoData.features[0].geometry.coordinates
  };

  const images = req.files.map(f => ({
    url: f.path,
    filename: f.filename
  }));

 
  delete req.body.campground.geometry;

  const camp = new campground({
    ...req.body.campground,
    geometry,
    images,
    postedBy: req.user._id
  });
console.log(JSON.stringify(camp, null, 2));

  await camp.save();
  req.flash('success', 'Successfully created the campground');
  res.redirect(`/campground/${camp._id}`);
};


module.exports.selectCamp=async (req, res, next) => {
    // const camp = await campground.findById(req.params.id).populate('reviews').populate('postedBy'); // <- FIXED
    const camp = await campground.findById(req.params.id)
    .populate({
        path: 'reviews',
        populate: { path: 'postedBy' }  // This is the fix
    })
    .populate('postedBy');

    if (!camp) {
        req.flash('error','Campground Not Found');
        return res.redirect('/campground/camp');
        // return next(new AppError('Campground Not Found', 404));
    }
    res.render('campground/select', { camp });
}

module.exports.editCamp=async(req,res,next)=>{
try{
    const camp= await campground.findById(req.params.id)
    if(!camp){
        throw new AppError('Campground Not Found', 404);
        // req.flash('error','Campground Not Found');
        // return res.redirect('/campground/camp');
        // return next(new AppError('Campground Not Found', 404));
    }
    res.render('campground/edit',{camp})

}catch(e){
    next(e);
}
}


module.exports.updateCamp=async(req,res,next)=>{

    const {id}=req.params;

    // const camp= await campground.findById(id);
    // if(!camp){
    //     req.flash('error','Campground Not Found');
    //     return res.redirect('/campground/camp');
    //     // return next(new AppError('Campground Not Found', 404));
    // }
    // if(!camp.postedBy.equals(req.user._id)){
    //     req.flash('error','You do not have permission to edit this campground');
    //     return res.redirect(`/campground/${id}`);
    //     // return next(new AppError('You do not have permission to edit this campground', 403));
    // }
    const camp=await campground.findByIdAndUpdate(id,req.body.campground,{runValidators:true,new:true})
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}))
    camp.images.push(...imgs);
        await camp.save();
    if(req.body.deleteImages){
        for (const filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
        console.log(camp)
    }
    const geoData=await maptilerClient.geocoding.forward(
        req.body.campground.location,{limit:1}
    )
    // camp.geometry=geoData.features[0].geometry;
    camp.geometry = {
  type: 'Point',
  coordinates: geoData.features[0].geometry.coordinates
};
    await camp.save();
    
     req.flash('success','successfully updated the campground')
    res.redirect(`/campground/${camp._id}`)



}

module.exports.deleteCamp=async(req,res)=>{
    const camps= await campground.findById(req.params.id);
    if(!camps.postedBy.equals(req.user._id)){
        req.flash('error','You do not have permission to delete this campground');
        return res.redirect(`/campground/${camps.id}`);
    }
    const camp= await campground.findByIdAndDelete(req.params.id)
    const campgrounds=await campground.find({})
    res.redirect('/campground/camp');
    // res.render('campground/show',{campgrounds})
}