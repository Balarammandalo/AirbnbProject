if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}

const express  = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const flash = require("connect-flash")
const User = require("./models/user.js")
const passport = require("passport")
const LocalStrategy = require("passport-local")


// const Listing = require("./models/listing.js")
// const wrapAsync = require("./utils/wrapAsync.js")
// const {listingSchema} = require("./schema.js")
// const {reviewSchema} = require("./schema.js")
// const Review = require("./models/review.js")

const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

const user = require("./models/user.js")

// const mongoDbUrl = "mongodb://localhost:27017/wanderlust"

const dbUrl = process.env.ATLASDB_URL;

const main = async() =>{
    await mongoose.connect(dbUrl)
}

main().then(res => console.log("connected to DB")).catch(err => console.log(err))

app.engine('ejs' , ejsMate)

app.set("view engine" , "ejs")
app.set("views", path.join(__dirname , "views"))

app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname , "public")))
app.use(express.urlencoded({extended: true}))

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{secret: process.env.SECRET},
    touchAfter: 24 * 3600
})
store.on("error" , () =>{
    console.log("ERROR  IN MONGO SESSION STORE" , err)
})

const sessionOption = {
    store: store, 
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expire : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOption))
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req , res , next) =>{
    res.locals.successMsg = req.flash("success")
    res.locals.errorMsg = req.flash("error")
    res.locals.currUser = req.user
    next()
})

app.use("/listings" , listingRouter)
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter)

app.all("*", (req , res , next) =>{
    next(new ExpressError(404 , "Page Not found!"))
})

app.use((err, req , res , next)=>{
    let {status = 500 , message = "Please Enter validity data"} = err
    console.log(err)
    res.status(status).render("listings/error.ejs" , {message})
 })

app.listen(3000,(req, res) =>{
    console.log("App listen on 3000 port")
})