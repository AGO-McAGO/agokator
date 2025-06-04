"use strict";

const express = require("express");
const router = express.Router();
const Contactkator = require("../models/Contactkator");
const Galleryphoto = require("../models/Galleryphoto");
const Homepage = require("../models/Homepage");

//! "homepage", get method
router.get("/", async (request, response) => {
  try {
    const locals = {
      title: "AGO Kator Celdric Official Website and Portfolio",
      keywords: "AGO, Kator, Celdric Official Website, AGO Kator Celdric Portfolio",
      description: "AGO Kator Celdric Official Website and Portfolio",
      author: "AGO SOO McAGO",
    };

    const homeHeroSection = await Homepage.find();
    response.render("index", { locals, homeHeroSection, currentRoute: "/" } );
  } catch (error) {
    console.log(error);
  }
} );

//! "basketball" page, get method
router.get("/basketball", async (request, response) => {
  try {
    const locals = {
      title: "AGO Kator Celdric Basketball Profile",
      keywords: "AGO, Kator, Celdric, Basketball Profile, AGO Kator Celdric Basketball Profile, Basketball",
      description: "AGO Kator Celdric Basketball Profile",
      author: "AGO SOO McAGO",
    };

    // const data = await Basketball.find();
    response.render("basketball", { locals, /*data,*/ currentRoute: "/basketball" } );
  } catch (error) {
    console.log(error);
  }
} );

//! "resume" page, get method
router.get("/resume", async (request, response) => {
  try {
    const locals = {
      title: "AGO Kator Celdric Resume and CV",
      keywords: "AGO, Kator, Celdric, Resume and CV, AGO Kator Celdric Resume and CV, Resume, CV",
      description: "AGO Kator Celdric Resume and CV",
      author: "AGO SOO McAGO",
    };

    // const data = await Resume.find();
    response.render("resume", { locals, /*data,*/ currentRoute: "/resume" } );
  } catch (error) {
    console.log(error);
  }
} );

//! "gallery" page, get method
router.get("/gallery", async (request, response) => {
  try {
    const locals = {
      title: "AGO Kator Celdric Gallery",
      keywords: "AGO, Kator, Celdric, Gallery, AGO Kator Celdric Gallery, Gallery, Pictures, Photos",
      description: "AGO Kator Celdric Gallery",
      author: "AGO SOO McAGO",
    };
    
    const photos = await Galleryphoto.find();

    response.render("gallery", { locals, photos, currentRoute: "/gallery" } );
  } catch (error) {
    console.log(error);
  }
} );

//! "about" page, get method
router.get("/about", async (request, response) => {
  try {
    const locals = {
      title: "AGO Kator Celdric About Information",
      keywords: "AGO, Kator, Celdric, About Information, AGO Kator Celdric About Information, About Information, About",
      description: "AGO Kator Celdric About Information",
      author: "AGO SOO McAGO",
    };

    // const abouts = await Aboutkator.find();
    response.render("about", { locals, /*abouts,*/ currentRoute: "/about" } );
  } catch (error) {
    console.log(error);
  }
} );

//! "contact" page, get method
router.get("/contact", async (request, response) => {
  try {
    const locals = {
      title: "AGO Kator Celdric Contact Information",
      keywords: "AGO, Kator, Celdric, Contact Information, AGO Kator Celdric Contact Information, Contact Information, Pictures, Photos",
      description: "AGO Kator Celdric Contact Information",
      author: "AGO SOO McAGO",
    };
    
    const contact = await Contactkator.find();
    response.render("contact", { locals, contact, currentRoute: "/contact" } );
  } catch (error) {
    console.log(error);
  }
} );

//! "search" page, post method
router.post("/search", async (request, response) => {
  try {
    const locals = {
      title: "Search",
      description: "AGO Kator CeldricOfficial Website and Portfolio",
    };

    let searchTerm = request.body.searchTerm; // to get the search term (from the form) entered by the user
    const NoSpecialCharacters = searchTerm.replace(/[^a-zA-Z0-9 ]/g, ""); // regex to get rid of special characters entered by the user

    const data = await Project.find({
      $or: [
        // to search the title or the body
        { title: { $regex: new RegExp(NoSpecialCharacters, "i") } },
        {
          projectdescription: { $regex: new RegExp(NoSpecialCharacters, "i") },
        },
      ],
    } );

    response.render("search", { locals, data, currentRoute: "/" } );
  } catch (error) {
    console.log(error);
  }
} );

module.exports = router;