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
const  rand=Math.floor(Math.random() * Data.length);
const seed=async(req,res)=>{
    await campground.deleteMany({});
    console.log(Data[rand].longituide, 
        Data[rand].latituide)
    
    for (let i = 0; i < 200; i++) {
        const random = Math.floor(Math.random() * Data.length);
        const camp = new campground({
            name: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
    type: "Point",
    coordinates: [
        Data[random].longituide, // Longitude
        Data[random].latituide // Latitude
    ]
              },
        
            location: `${Data[random].city}, ${Data[random].state}`,
            description: `${sample(descriptions)}`,
            // images :`https://picsum.photos/400?random=${Math.random()}`,
         images: [{
                url: `https://picsum.photos/400?random=${Math.random()}`,
                filename: `picsum-${i}`
            }],
            postedBy: '692830c3b8520aa333c276de', // Replace with actual user ID
            price: Math.floor(Math.random() * 1000),
        });

        await camp.save()  // Move save() inside the loop
    }


}
seed().then(()=>{
    mongoose.connection.close();
})
