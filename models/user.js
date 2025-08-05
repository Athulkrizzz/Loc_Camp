const mongoose = require('mongoose');
const schema = mongoose.Schema;
const PassportLocalMongoose = require('passport-local-mongoose');
const UserSchema=new schema({
    email:{
        type:String,
        required:true,
        unique:true
    },

})
UserSchema.plugin(PassportLocalMongoose)
module.exports = mongoose.model('User', UserSchema);