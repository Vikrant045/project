const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Review = require("./reviews.js");
const listing_Schema = new Schema({
  title: {
    type: String,
  },
  description: String,
  image: {
    url: String,
    filename:String
  },
  price: Number,
  location: {
    type: String,
  },
  country: {
    type: String,
  },

  reviews:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "review",
    }
  ],
  owner:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }

});
listing_Schema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }
});
const listing = mongoose.model("listing", listing_Schema);
module.exports = listing;
