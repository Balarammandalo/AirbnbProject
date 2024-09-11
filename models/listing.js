const mongoose = require("mongoose")
const {Schema} = mongoose
const Review = require("./review.js")

const listingSchema = new Schema({
    title: {
        type: String,
        required: true 
    },
    description: {
        type: String
    },
    image: {
        url: String , filename : String  
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    price:{
        type: Number
    },
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref : "Review"
         }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

listingSchema.post("findOneAndDelete" , async (listing) =>{
    if(listing.reviews.length){
        let result = await Review.deleteMany({_id : {$in : listing.reviews}} )
        console.log(result)
    }
})

const Listing = mongoose.model("Listing" , listingSchema)

module.exports = Listing