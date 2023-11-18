const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");


const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js"); 

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        req.flash("error","you must be logged In!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl =(req,res,next)=>{  // to store the redirect url of session
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res, next)=>{ // to check,user is owner of review or not
 let{id} = req.params;
 let lisitng = await Listing.findById(id);
 if(!lisitng.owner._id.equals(res.locals.currUser._id)){
    req.flash('error','You are not the owner of listing');
    return res.redirect(`/listings/${id}`);
 }
 next();
};

module.exports.isReviewAuthor = async(req,res, next)=>{  // to check,user is Author of review or not
    let{id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
       req.flash('error','You are not the author of review');
       return res.redirect(`/listings/${id}`);
    }
    next();
   };

module.exports.validateListing =(req,res,next)=>{   // schema validation middleware
    let {error} =listingSchema.validate(req.body);
    if(error){
        console.log(error);
       // console.log(req.body);
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

module.exports.validateReview =(req,res,next)=>{   // review validation middleware
    let {error} =reviewSchema.validate(req.body);
    if(error){
        console.log(error);
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};
