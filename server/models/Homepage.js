"use strict";


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HomepageSchema = new Schema( {
  heroheading: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  herotext: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  heroimage: {
    type: String,
    required: true
  },
  heroimagecaption: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
} );

module.exports = mongoose.model("Homepage", HomepageSchema);