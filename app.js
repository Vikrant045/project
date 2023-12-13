if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
   }

const express = require("express");
const app  = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");

const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const Joi = require("joi");

const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const User = require("./models/user.js");

const Atlas_Url =process.env.ATLAS_URL;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));




                                           //connect to mongodb database
async function main(){
    await mongoose.connect(Atlas_Url);
}
main().then(()=>{
    console.log("mongo runs successfully");
}).catch((er)=>{
    console.log(er);
});

const store = MongoStore.create({  //mongostore for mongoAtlas
  mongoUrl: Atlas_Url,
  crypto:{
secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("error in MONGO SESSION",err);
});

 const sessionOptions = {    //session
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
  },
};



app.use(session(sessionOptions));  //init session
app.use(flash());                 // initialize flash

                                   // Password authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})
// listing routes
app.use("/listings", listingRouter);      

//reviews routes
app.use("/listings/:id/reviews",reviewRouter);

app.use("/",userRouter);


  app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
  });
  app.use((err,req,res,next)=>{
    const {statusCode = 500 , message="Something went wrong"} = err;
    res.status(statusCode).render("./listing/error.ejs",{message});
  });

app.listen(3000,()=>{
    console.log("server runs sucessfully" );
});

