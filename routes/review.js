const express = require("express")
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")

const {reviewSchema} = require("../schema.js")
const Review = require("../models/review.js")
const Listing = require("../models/listing.js")
const {isAuthoentic , isReviewAuthor} = require("../authentic.js")

const {createReview , destroyReview} =  require("../controllers/review.js")


const reviewValidate = (req, res , next) => {
    // console.log(reviewSchema.validate(req.body))
    // console.log("///////------------")
    const {error} = reviewSchema.validate(req.body)
    if(error){
        console.log(error)
        const errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400 , errMsg)
    }else{
        next()
    }
}

//Post Review Route
router.post("/" ,isAuthoentic , reviewValidate ,wrapAsync(createReview))

// //Delete Review Route
router.delete("/:reviewId",isAuthoentic , isReviewAuthor ,wrapAsync(destroyReview))

module.exports = router
