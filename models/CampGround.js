const mongoose = require('mongoose');
const Review = require('./review');

const Schema = mongoose.Schema; 
const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload','/upload/w_200');
});

const CampgroundSchema=new Schema({
    name:{
        type:String,
        required:true   
    },
    price:Number,
    images:[imageSchema],
    geometry: {
        type: {
            type: String, // 'location.type' must be 'Point'
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },

    description:String,
    location:String,
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:'Review'
    }],
    postedBy:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
})


CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        const res = await Review.deleteMany({ _id: { $in: doc.reviews } })
        console.log(res);
    }
})
module.exports=new mongoose.model('Campground',CampgroundSchema);


