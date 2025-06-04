"use strict";


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema( {
    username: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
} );

module.exports = mongoose.model("User", UserSchema);
