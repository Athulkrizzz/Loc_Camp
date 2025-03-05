const express=require('express');
const app=express();
const path=require('path');
const ejsMate=require('ejs-mate');
const methodOverride=require('method-override');
const mongoose=require('mongoose');
const campground=require('./models/CampGround')


app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));


mongoose.connect('mongodb://127.0.0.1:27017/LocCamp')
.then(()=>{
    console.log('connection established for mongo')
})
.catch((err)=>{
    console.log('error!!!')
})


app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/campground',async(req,res)=>{
    const campgrounds=await campground.find({})

    res.render('campground/index',{campgrounds})
})
app.get('/campground/new',async(req,res)=>{
    res.render('campground/new')
})
app.post('/campground', async (req, res) => {
    console.log("Request Body:", req.body); // Debugging

    try {
        const camp = new campground(req.body);
        await camp.save();
        res.redirect('/campground');
    } catch (err) {
        console.error(err);
        res.status(400).send('Error: Campground validation failed. Name is required.');
    }
});

app.get('/campground/:id',async(req,res)=>{

    const camp= await campground.findById(req.params.id)
    res.render('campground/select',{camp})
})


app.get('/campground/:id/edit',async(req,res)=>{

    const camp= await campground.findById(req.params.id)
    res.render('campground/edit',{camp})
})

app.put('/campground/:id',async(req,res)=>{

    const {id}=req.params;
    const camp=await campground.findByIdAndUpdate(id,req.body,{runValidators:true,new:true})
    res.redirect(`/campground/${camp._id}`)


})

app.delete('/campground/:id',async(req,res)=>{

    const camp= await campground.findByIdAndDelete(req.params.id)
    const campgrounds=await campground.find({})
    res.redirect('/campground');
    // res.render('campground/show',{campgrounds})
})

app.listen(3000,()=>{
    console.log('Listeninggggggg');
})