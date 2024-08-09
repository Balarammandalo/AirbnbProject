const mongoose = require("mongoose")
const initData = require("./data")

const listing = require("../models/listing.js")

const main = async() =>{
    await mongoose.connect("mongodb://localhost:27017/wanderlust")
}

main().then(res => console.log("connected to DB")).catch(err => console.log(err))


const initDb = async () =>{
    await listing.deleteMany({})
    await listing.insertMany(initData.data)
    console.log("data was added")
}

initDb()