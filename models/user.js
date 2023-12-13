const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema =  new Schema({//passport automatic generates userName & password fields
    email:{
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose); // to features of hashing salting

module.exports= mongoose.model('User',userSchema);