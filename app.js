const express  = require("express")
const app = express()
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")


const main = async() =>{
    await mongoose.connect("mongodb://localhost:27017/wanderlust")
}

main().then(res => console.log("connected to DB")).catch(err => console.log(err))

app.engine('ejs' , ejsMate)

app.set("view engine" , "ejs")
app.set("views", path.join(__dirname , "views"))

app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname , "public")))
app.use(express.urlencoded({extended: true}))

app.get("/" , (req,res)=>{
    res.send("Successfully Root Connect")
})

//get All Listings
app.get("/listings" , async (req , res) =>{
    const allListings = await Listing.find({})
    res.render("./listings/index.ejs" , {allListings})
})

//create a new 
app.get("/listings/new" , (req,res) =>{
    res.render("listings/new.ejs")
})

//Id Details
app.get("/listings/:id" , async(req,res) =>{
    const {id} = req.params
    const listings = await Listing.findById(id)
    res.render("listings/show.ejs" , {listings})
})

// new Listing Add in DB 
app.post("/listings" , async(req,res) =>{
    // const {title, price, description, location , country , image} = req.body 
    const inputListing = req.body.listing;
    const newListing = new Listing(inputListing)
    newListing.save()
    res.redirect("/listings")
})

//get Edit throw id 
app.get("/listings/:id/edit" , async (req,res) =>{
    const { id } = req.params
    const listing = await Listing.findById(id)
    res.render("listings/edit.ejs" , {listing})
})

//update the new listing 
app.put("/listings/:id" , async (req , res) =>{
    const { id } = req.params
    await Listing.findByIdAndUpdate(id , {...req.body.listing})
    res.redirect(`/listings/${id}`)
})

//delete listing
app.delete("/listings/:id" , async (req, res) =>{
    const { id } = req.params
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
})


// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   })
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

app.listen(3000,(req, res) =>{
    console.log("App listen on 3000 port")
})