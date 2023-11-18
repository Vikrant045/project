const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.Add_newReview = async(req,res)=>{  // add new review
    let listing = await Listing.findById(req.params.id);
    let newReview = await new Review(req.body.review);

    newReview.author = req.user._id;
console.log(newReview.author);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${req.params.id}`);    
  }

  module.exports.delete_review = async(req,res)=>{  //deletw review
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
 }