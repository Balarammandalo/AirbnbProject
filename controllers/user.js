const User = require("../models/user")

module.exports.renderSignupForm = (req,res) =>{
    res.render("users/signup.ejs")
}

module.exports.signup = async(req,res) =>{
    try{
    let {username , email, password} = req.body
    const newUser = new User({
        email , username
    })
    const userRegister = await User.register(newUser , password)
    console.log(userRegister)
    req.login(userRegister , (err) =>{
        if(err){
           return next(err)
        }
        req.flash("success" , "Welcome to Wonderlust")
        res.redirect("/listings")
    })
    
    }catch(err){
        req.flash("error", err.message)
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm =  (req,res) =>{
    res.render("users/login.ejs")
}

module.exports.login = async(req,res) =>{
    req.flash("success" , "Welcome back to woonderlust!")
    const redirectUrlSave = res.locals.saveOriginalUrl || "/listings"
    res.redirect(redirectUrlSave)
}

module.exports.logout = (req , res , next) =>{
    req.logout((err) =>{
        if(err){
            return next(err)
        }
        req.flash("success" , "You are logged out!")
        res.redirect("/listings")
    })
}