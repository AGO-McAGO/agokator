"use strict";


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactkatorSchema = new Schema( {
  homeaddress: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  emailaddress: {
    type: String, //! check type of
    required: true,
    minlength: 7,
    maxlength: 50
  },
  phonenumber: {
    type: String, //! check type of
    required: true,
    minlength: 10,
    maxlength: 15
  }
} );

module.exports = mongoose.model("Contactkator", ContactkatorSchema);