const express=require('express');
const app=express();
const path=require('path');
const ejsMate=require('ejs-mate');
const methodOverride=require('method-override');
const mongoose=require('mongoose');
const campground=require('./models/CampGround')
const AppError=require('./utils/AppError')
const wrapAsync=require('./utils/wrapAsync')
const session=require('express-session');
const flash=require('connect-flash')
const joi=require('joi');
const {campgroundschema}=require('./campgroundschema');
const { reviewSchema } = require('./campgroundschema');
const camproutes=require('./routes/campground');
const reviewroutes=require('./routes/review');
const userroutes=require('./routes/user');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');


app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));


const sessionConfig={
    secret: 'thisshouldbe a long secret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now()  + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7 // 7 days
    }
}
app.use(session(sessionConfig))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req,res,next)=>{
    res.locals.currentuser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error')
    next();
    
})
const validateReview= (req,res,next)=>{
    // const reviewSchema=joi.object({
    //     review:joi.object({
    //         body:joi.string().required(),
    //         rating:joi.number().required().min(1).max(5)
    //     }).required()
    // })
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new AppError(msg,400);
    }
    }

mongoose.connect('mongodb://127.0.0.1:27017/LocCamp')
.then(()=>{
    console.log('connection established for mongo')
})
.catch((err)=>{
    console.log('error!!!')
})

app.get('/logout',(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','Logged Out Successfully')
        res.redirect('/login');
    })
})


app.use('/',userroutes);
app.use('/campground',camproutes);
app.use('/campground/:id/review',reviewroutes);
app.all('*',(req,res,next)=>{
    next(new AppError("Page Not Found",404))
})
app.use((req,res)=>{
    res.status(404).send("Page Not Found")
})

app.use((err,req,res,next)=>{
    const {status=500,message='Something went Wrong'}=err;
    res.status(status).render('campground/error',{err});
})

app.listen(3000,()=>{
    console.log('Listeninggggggg');
})