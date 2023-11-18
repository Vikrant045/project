const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}= require("../middleware.js");
const listingController = require("../controllers/listing.js");

const multer  = require('multer');  // to parse image file data
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

//Index route 
router.route("/")
      .get(wrapAsync(listingController.index))
      .post(isLoggedIn, upload.single("listing[image]"),validateListing , 
       wrapAsync(listingController.create_new_listing) );

 // Create New listing Route
 router.get("/new",isLoggedIn,listingController.renderNew_form);

router.route("/:id")
      .get(wrapAsync(listingController.show_listing))
      .put(isLoggedIn,isOwner,upload.single("listing[image]"),
      validateListing,wrapAsync(listingController.update_listing))
      .delete(isLoggedIn,isOwner,wrapAsync(listingController.delete_lisitng));

  // edit route
  router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.render_editing_form)
  );


    module.exports= router;
