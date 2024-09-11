const Listing = require("../models/listing")
const Review = require("../models/review")

module.exports.createReview = async (req, res)=>{
    const listing = await Listing.findById(req.params.id)
    const newReviews = new Review(req.body.review)
    newReviews.author = req.user._id
    // console.log(newReviews)
    listing.reviews.push(newReviews)

    await listing.save()
    await newReviews.save()
    req.flash("success" , "New Review Created")
    res.redirect(`/listings/${listing.id}`)
}

module.exports.destroyReview = async (req , res) =>{
    const {id , reviewId} = req.params

    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success" , "Review Deleted")
    res.redirect(`/listings/${id}`)
}