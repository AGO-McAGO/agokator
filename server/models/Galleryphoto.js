"use strict";


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GalleryphotoSchema = new Schema( {
  galleryimage: {
    type: String,
    required: true
  },
  galleryimagecaption: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
} );

module.exports = mongoose.model("Galleryphoto", GalleryphotoSchema);