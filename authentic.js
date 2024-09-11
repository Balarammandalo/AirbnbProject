const Listing = require("./models/listing.js")
const Review = require("./models/review.js")

module.exports.isAuthoentic = (req , res , next) =>{
    // console.log(req.path , "...." , req.originalUrl) it's store in the req.user)
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash("error" , "You must be logged in to create Listing")
        return res.redirect("/login")
    }
    next()
}

module.exports.saveRedirectUrl = (req, res , next) =>{
    if(req.session.redirectUrl){
        res.locals.saveOriginalUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async (req ,res , next) =>{
    const {id} = req.params
    const listing = await Listing.findById(id)
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the owner of this listing")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async(req , res , next)=>{
    const {id,reviewId} = req.params
    const review = await Review.findById(reviewId)
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the author of this review");
        return res.redirect(`/listings/${id}`)
    }
    next()
}