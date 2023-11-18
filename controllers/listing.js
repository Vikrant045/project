const Listing = require("../models/listing.js");

module.exports.index = async(req,res)=>{  // index 
    let data = await Listing.find({});
   res.render("./listing/index.ejs",{data});
  }

  module.exports.renderNew_form = (req,res)=>{  // new form render
    res.render("./listing/new.ejs");
}

module.exports.show_listing = async(req,res)=>{ // show lisitng
    let {id}= req.params;
     let list = await Listing.findById(id).populate({
      path:"reviews", populate:{path:"author",},
  }).populate("owner");
     console.log("List:", list.reviews);
     if(!list){
      req.flash("error","Listing does not exist!");
      res.redirect("/listings");
     }
     res.render("./listing/show.ejs",{list});
 }

 module.exports.create_new_listing = async(req,res,next)=>{ // post new listing

    let url = req.file.path;
    let filename = req.file.filename;
    let newlisting=  new Listing(req.body.listing);
    newlisting.owner= req.user._id;

    newlisting.image ={url,filename};
   await newlisting.save();
   console.log(newlisting);
   req.flash("success","New Listing Created!");
   res.redirect("/listings");
}

module.exports.render_editing_form = async(req,res)=>{  // render lisitng editing form 
    let {id} = req.params;
    let listing = await Listing.findById(id);
   console.log(listing);
   if(!listing){
      req.flash("error","Listing does not exist!");
      res.redirect("/listings");
     }
     let org_image_url = listing.image.url;
     org_image_url = org_image_url.replace("/upload","/upload/w_250");
     console.log(org_image_url);

     res.render("./listing/edit.ejs",{listing,org_image_url});
}

module.exports.update_listing = async(req,res)=>{          //update listing
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing");
    }
  let {id} = req.params;
  let listing =await Listing.findByIdAndUpdate(id,{...req.body.listing});
  if( typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image={url,filename};
    await listing.save();
  }
  req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
}

module.exports.delete_lisitng = async(req,res)=>{ //delete listing
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success"," Listing Deleted!");
    res.redirect(`/listings`);
  }