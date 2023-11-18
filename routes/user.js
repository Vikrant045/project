const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.route("/signup")
      .get(userController.render_signUp_form) 
      .post(wrapAsync(userController.signUp));

router.route("/login")
      .get(userController.render_logIn_form) 
      .post(saveRedirectUrl,passport.authenticate("local",{
        failureRedirect:"/listings",
        failureFlash:true,
    }), userController.logIn);

 router.get("/logout", userController.logOut);    // logout

module.exports =router;