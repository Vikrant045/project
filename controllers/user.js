const User = require("../models/user.js");

module.exports.render_signUp_form = (req,res)=>{     // render signup form
    res.render("users/signUp.ejs");
 }

 module.exports.signUp = async(req,res)=>{   //sign up 
    try{
        let{username, email,password}= req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser,password);
          // direct login after signup 
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to wonderLust!");
            res.redirect("/listings");
        });  
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("signup");
    }
}

module.exports.render_logIn_form = (req,res)=>{  //render login
    res.render("users/login.ejs");
 }

 module.exports.logIn = async(req,res)=>{    //login
    req.flash("success","welcome to wonderlust!");
   let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    }

module.exports.logOut = (req,res,next)=>{ //logout
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
            req.flash("success","you are logged out successfully!");
            res.redirect("/listings");
    });
 }