const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema} = require("../schema.js"); 
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor}= require("../middleware.js");

const reviewController = require("../controllers/review.js");


  //review post route
  router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.Add_newReview));

  // delete review 
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.delete_review)
  );

  module.exports= router;



