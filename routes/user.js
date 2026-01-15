const app= require('express');
const router = app.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');


router.get('/register', (req, res) => {
    res.render('user/register');
}
);
router.post('/register',wrapAsync( async (req, res) => {
    try{
    const {email,username,password}=req.body;
    const user=new User({email,username})
    const registeredUser=await User.register(user,password);
    res.redirect('/login');
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}))
router.get('/login',(req,res)=>{
    res.render('user/login')
})
router.post('/login', passport.authenticate('local',{failureFlash:true,failureRedirect:'login'}),(req, res) => {
    req.flash('Success','Successfully Logged In')
    res.redirect('campground/camp')
})
module.exports= router;

