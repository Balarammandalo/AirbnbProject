const mongoose = require("mongoose")
const initData = require("./data")

const listing = require("../models/listing.js")

const main = async() =>{
    await mongoose.connect("mongodb://localhost:27017/wanderlust")
}

main().then(res => console.log("connected to DB")).catch(err => console.log(err))


const initDb = async () =>{
    await listing.deleteMany({})
    const newInitdata = initData.data.map((eachObj) =>({...eachObj , owner:'66d5bc490e13ef6633eb2aa0'}))
    await listing.insertMany(newInitdata)
    console.log("data was added")
}

initDb()