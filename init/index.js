const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const initData = require("./data.js");
//const Atlas_Url =process.env.ATLAS_URL;

const Atlas_Url =process.env.ATLAS_URL;

//connect to mongodb database
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}
main().then(()=>{
    console.log("mongo runs successfully");
}).catch((er)=>{
    console.log(er);
});

const initDb = async()=>{
    await listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:"654896396aae4ac1e5477602"}));
    await listing.insertMany(initData.data);
    console.log("data initialized successfully");
};
initDb();
