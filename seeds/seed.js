const mongoose=require('mongoose');
const campground=require('../models/CampGround')
const Data=require('./data')
const {descriptors,places,descriptions}=require('./describe')
mongoose.connect('mongodb://127.0.0.1:27017/LocCamp')
.then(()=>{
    console.log('connection established for mongo')
})
.catch((err)=>{
    console.log('error!!!')
})


const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seed=async(req,res)=>{
    await campground.deleteMany({});
    
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * Data.length);
        const camp = new campground({
            name: `${sample(descriptors)} ${sample(places)}`,
            location: `${Data[random].city}, ${Data[random].state}`,
            description: `${sample(descriptions)}`,
            image:`https://picsum.photos/400?random=${Math.random()}`
        });

        await camp.save();  // Move save() inside the loop
    }


}
seed().then(()=>{
    mongoose.connection.close();
})
