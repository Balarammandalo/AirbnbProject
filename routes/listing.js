const express = require("express")
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema} = require("../schema.js")
const Listing = require("../models/listing.js")

const {index , renderNewForm , showListing , createListing , renderEditForm , updateListing , destroyListing} = require("../controllers/listing.js")

const {isAuthoentic , isOwner} = require("../authentic.js")

const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })


const validatelisting = (req, res , next) =>{
    const {error} = listingSchema.validate(req.body)
    if(error){
        console.log(error)
        const errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400 , errMsg)
    }else{
        next()
    }
}

router.route("/").get(wrapAsync( index)).post(isAuthoentic ,upload.single('listing[image]') , validatelisting , wrapAsync(createListing))

//create a new 
router.get("/new" ,isAuthoentic, renderNewForm)

router.route("/:id").get(wrapAsync( showListing))
    .put(isAuthoentic , isOwner, upload.single('listing[image]') , validatelisting ,wrapAsync( updateListing))
    .delete(isAuthoentic, isOwner ,wrapAsync( destroyListing))
    
// get Edit throw id 
router.get("/:id/edit" ,isAuthoentic,isOwner ,wrapAsync( renderEditForm))

//get All Listings
// router.get("/" ,wrapAsync( index))

//show routes Id Details
// router.get("/:id" ,wrapAsync( showListing))

//Create new Listing Add in DB 
// router.post("/" , validatelisting , wrapAsync(createListing))



//update the new listing 
// router.put("/:id",isAuthoentic , isOwner,validatelisting ,wrapAsync( updateListing))

//delete listing
// router.delete("/:id",isAuthoentic, isOwner ,wrapAsync( destroyListing))




module.exports = router