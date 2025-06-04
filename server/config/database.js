"use strict";


const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false)
        const connect = await mongoose.connect(process.env.MONGODB_URI, {dbName: "agokator", useNewUrlParser: true, useUnifiedTopology: true} );
        console.log("Connection successful!");
    } catch (error) {
        console.log("Connection Error!" + error);
    }
};

module.exports = connectDB;