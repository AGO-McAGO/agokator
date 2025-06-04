"use strict";

const express = require("express");
const router = express.Router();
const Contactkator = require("../models/Contactkator");
const Galleryphoto = require("../models/Galleryphoto");
const Homepage = require("../models/Homepage");
// const Galleryphoto = require("../models/Galleryphoto");
const User = require("../models/User");
const bcrypt = require("bcrypt"); // to enable encrypting the password before storing it in the database.
const jwt = require("jsonwebtoken");
const fs = require("fs");

const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

//! AuthMiddleware, so only authorized users can view certain pages, after logging in.
const authMiddleware = (request, response, next) => {
  const token = request.cookies.token; // to get the cookie from the browser.

  const locals = {
      title: "Dashboard for AGO Kator Celdric",
      keywords: "AGO, Kator, Celdric, Official Website, Dashboard",
      description: "AGO Kator Celdric Official Dashboard",
      author: "AGO SOO McAGO",
    };

  if (!token) {
    // if there's no token ....
    return response.render("admin/errorpage", { locals, layout: adminLayout, currentRoute: "/errorpage" } ); // show error page.
  }

  try {
    const decoded = jwt.verify(token, jwtSecret); // verify token to confirm it has the same secret.
    request.userId = decoded.userId;
    next();
  } catch (error) {
    response.status(401).json( { message: "Unauthorized" } ); /* create a page/pop up to display this message. */
  }
};

// "login or register" page, get method
router.get("/admin", async (request, response) => {
  try {
    const locals = {
      title: "Admin Login Registration",
      keywords: "AGO, Kator, Celdric, Official Website, Admin, Login, Registration",
      description: "AGO Kator Celdric Admin Login Registration",
      author: "AGO SOO McAGO",
    };

    response.render("admin/adminlogin", { locals, layout: adminLayout, currentRoute: "/adminlogin" } );
  } catch (error) {
    console.log(error);
  }
} );

// "register", post method
router.post("/register", async (request, response) => {
  try {
    const { username, password } = request.body; // grab the username and password.
    const hashedPassword = await bcrypt.hash(password, 10); // to hash the password.

    try {
      const user = await User.create({ username, password: hashedPassword }); // to create the user.
      response.status(201).json( { message: "User Created", user } ); /* create a page/pop up to display this message. */
    } catch (error) {
      if (error.code === 11000) {
        response.status(409).json( { message: "User already in use" } ); /* create a page/pop up to display this message. */
      }
      response.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
  }
} );

// "login", post method
router.post("/admin", async (request, response) => {
  try {
    const { username, password } = request.body;
    const user = await User.findOne({ username }); // to find username entered by the user in the database.

    const locals = {
      title: "Dashboard for AGO Kator Celdric",
      keywords: "AGO, Kator, Celdric, Official Website, Dashboard",
      description: "AGO Kator Celdric Official Dashboard",
      author: "AGO SOO McAGO",
    };

    if (!user) {
      // if user doesn't exist ....
      return response.render("admin/errorcredentials", { locals, layout: adminLayout, currentRoute: "/errorcredentials" } ); // show error page for invalid credentials.
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); // compare the password from the form with the user's password in the database.

    if (!isPasswordValid) {
      // if password doesn't match ....
      return response.render("admin/errorcredentials", { locals, layout: adminLayout, currentRoute: "/errorcredentials" } ); // show error page for invalid credentials.
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret); // create a token to the cookie.
    response.cookie("token", token, { httpOnly: true }); // to save the token into cookie.
    response.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

// "dashboard" page, get method
router.get("/dashboard", authMiddleware, async (request, respnse) => { //? "authMiddleware" here so only a logged in user can view the dashboard.
  try {
    const locals = {
      title: "Dashboard for AGO Kator Celdric",
      keywords: "AGO, Kator, Celdric, Official Website, Dashboard",
      description: "AGO Kator Celdric Official Dashboard",
      author: "AGO SOO McAGO",
    };

    const heroSection = await Homepage.find();
    const contacts = await Contactkator.find();
    const photos = await Galleryphoto.find();

    respnse.render("admin/dashboard", { locals, heroSection, contacts, photos, layout: adminLayout, currentRoute: "/adminpanel" } );
  } catch (error) {
    console.log(error);
  }
} );

//! Homepage/index *********** */
// ""add homepage information" page, get method
router.get("/addhomepage", authMiddleware, async (request, response) => {
  try {
    const locals = {
      title: "Add Homepage Information",
      keywords: "AGO, Kator, Celdric, Official Website, Add Homepage, Information, Homepage Information",
      description: "AGO Kator Celdric Official Website Adding Homepage Information",
      author: "AGO SOO McAGO",
    };

    response.render("admin/addhomepage", { locals, layout: adminLayout, currentRoute: "/adminpanel" } );
  } catch (error) {
    console.log(error);
  }
} );

// "add homepage information", post method
router.post("/addhomepage", authMiddleware, async (request, response) => {
  try {
    let heroImageFile;
    let heroImageUploadPath;
    let newHeroImageName;

    if (!request.files || Object.keys(request.files).length === 0) {
      console.log("Files uploaded unsuccessful.");
    } else {
      heroImageFile = request.files.heroimage;
      newHeroImageName = Date.now() + heroImageFile.name;
      heroImageUploadPath = require("path").resolve("./") + "/public/img/uploads/homepage/" + newHeroImageName;

      heroImageFile.mv(heroImageUploadPath, function (error) {
        if (error) return response.satus(500).send(error);
      } );
    }

    try {
      const newHomepage = new Homepage( {
        heroheading: request.body.heroheading,
        herotext: request.body.herotext,
        heroimage: newHeroImageName,
        heroimagecaption: request.body.heroimagecaption
      } );

      await Homepage.create(newHomepage);
      response.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    response.redirect("/dashboard");
  }
} );

// "update homepage information" page, get method
router.get("/updatehomepage/:id", authMiddleware, async (request, response) => {
  try {
    const locals = {
      title: "Update Homepage Information",
      keywords: "AGO, Kator, Celdric, Official Website, Add Homepage, Information, Update Homepage Information",
      description: "AGO Kator Celdric Official Website Updating Homepage Information",
      author: "AGO SOO McAGO",
    };

    let heroId = request.params.id;
    const data = await Homepage.findById(heroId);

    response.render("admin/updatehomepage", { locals, data, layout: adminLayout, currentRoute: "/adminpanel" } );
  } catch (error) {
    console.log(error);
  }
} );

// "update homepage information" page, put method
router.post("/updatehomepage/:id", authMiddleware, async (request, response) => {
  try {
    let heroId = request.params.id;
    let heroImageFile;
    let heroImageUploadPath;
    let newHeroImageName;

    if(!request.files || Object.keys(request.files).length === 0){
      console.log("File uploaded unsuccessful.");
    } else {
      fs.unlinkSync("./public/img/uploads/homepage/" + request.body.oldimage); // to remove the old image from the folder
      heroImageFile = request.files.heroimage;
      newHeroImageName = Date.now()+"_"+heroImageFile.name;
      heroImageUploadPath = require("path").resolve("./") + "/public/img/uploads/homepage/" + newHeroImageName;

      heroImageFile.mv(heroImageUploadPath, function(error){
        if(error) return response.satus(500).send(error);
      } )
    }

    const updateHomepage = {
      heroheading: request.body.heroheading,
      herotext: request.body.herotext,
      heroimage: newHeroImageName,
      heroimagecaption: request.body.heroimagecaption
    };

    const data = await Homepage.findById(heroId);

    await Homepage.findByIdAndUpdate(heroId, updateHomepage);
    
    response.redirect( `/updatehomepage/${heroId}`);
  } catch (error) {
    console.log(error);
    response.redirect(`/updatehomepage/${request.params.id}`);
  }
} );

//! Contact *********** */
// "add contact information" page, get method
router.get("/addcontactpage", authMiddleware, async (request, response) => {
  try {
    const locals = {
      title: "Add Contact Information",
      keywords: "AGO, Kator, Celdric, Official Website, Add Contact page, Information, Contact page Information",
      description: "AGO Kator Celdric Official Website Adding Contact page Information",
      author: "AGO SOO McAGO",
    };

    response.render("admin/addcontactpage", { locals, layout: adminLayout, currentRoute: "/adminpanel" } );
  } catch (error) {
    console.log(error);
  }
} );

// add "contact information", post method
router.post("/addcontactpage", authMiddleware, async (request, response) => {
  try {
    try {
      const newContactkator = new Contactkator( {
        homeaddress: request.body.homeaddress,
        emailaddress: request.body.emailaddress,
        phonenumber: request.body.phonenumber
      } );

      await Contactkator.create(newContactkator);
      response.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }

  } catch (error) {
    console.log(error);
  }
} );

// "update contact information" page, get method
router.get("/updatecontactpage/:id", authMiddleware, async (request, response) => {
  try {
    const locals = {
      title: "Updating Contact Information",
      keywords: "AGO, Kator, Celdric, Official Website, Updating Contact page, Information, Contact page Information",
      description: "AGO Kator Celdric Official Website Updatinging Contact page Information",
      author: "AGO SOO McAGO",
    };

    let contactId = request.params.id;
    const contacts = await Contactkator.findById(contactId);

    response.render("admin/updatecontactpage", { locals, contacts, layout: adminLayout, currentRoute: "/adminpanel" } );
  } catch (error) {
    console.log(error);
  }

} );

// "update contact information", put method
router.put("/updatecontactpage/:id", authMiddleware, async (request, response) => {
  try {
    let contactId = request.params.id;
    
    await Contactkator.findByIdAndUpdate(contactId, {
      homeaddress: request.body.homeaddress,
      emailaddress: request.body.emailaddress,
      phonenumber: request.body.phonenumber
    } );
    
    response.redirect(`/updatecontactpage/${contactId}`);
  } catch (error) {
    console.log(error);
  }

} );

//! Gallery *********** */
// "add photo" page, get method
router.get("/addgallerypage", authMiddleware, async (request, response) => {

  try {
    const locals = {
      title: "Add Gallery Photos",
      keywords: "AGO, Kator, Celdric, Official Website, Add Gallery, Pictures, Photos, Gallery Photos",
      description: "AGO Kator Celdric Official Website Adding Gallery Photos",
      author: "AGO SOO McAGO"
    }

    response.render("admin/addgallerypage", { locals, layout: adminLayout, currentRoute: "/addgallerypage" } );
  } catch (error) {
    console.log(error);
  }

} );

// "add photo", post method
router.post("/addgallerypage", authMiddleware, async (request, response) => {
  try {
    let galleryImageFile;
    let galleryImageUploadPath;
    let newGalleryImageName;

    if (!request.files || Object.keys(request.files).length === 0) {
      console.log("Files uploaded unsuccessful.");
    } else {
      galleryImageFile = request.files.galleryimage;
      newGalleryImageName = Date.now() + galleryImageFile.name;
      galleryImageUploadPath = require("path").resolve("./") + "/public/img/uploads/gallerypage/" + newGalleryImageName;

      galleryImageFile.mv(galleryImageUploadPath, function (error) {
        if (error) return response.satus(500).send(error);
      } );
    }

    try {
      const newGalleryphoto = new Galleryphoto( {
        galleryimage: newGalleryImageName,
        galleryimagecaption: request.body.galleryimagecaption
      } );

      await Galleryphoto.create(newGalleryphoto);
      response.redirect("/addgallerypage");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    response.redirect("/dashboard");
  }
} );

// "update gallery" display all photos with action buttons page, get method
router.get("/admingallerypage", authMiddleware, async (request, response) => {
  try {

    const locals = {
      title: "Update Gallery Photos",
      keywords: "AGO, Kator, Celdric, Official Website, Update Gallery, Pictures, Photos, Gallery Photos",
      description: "AGO Kator Celdric Official Website Updateing Gallery Photos",
      author: "AGO SOO McAGO"
    };

    const photos = await Galleryphoto.find();

    response.render("admin/admingallerypage", { locals, photos, layout: adminLayout, currentRoute: "/dashboard" } );
  } catch (error) {
    console.log(error);
  }

} );

// "update gallery" single photo update page, get method
router.get("/updategallerypage/:id", authMiddleware, async (request, response) => {
  try {

    const locals = {
      title: "Update Photo",
      keywords: "AGO, Kator, Celdric, Official Website, Update Gallery, Pictures, Photos, Gallery Photos",
      description: "AGO Kator Celdric Official Website Updateing Gallery Photos",
      author: "AGO SOO McAGO"
    };

    const photos = await Galleryphoto.findOne( { _id: request.params.id } );
    //TODO try getting out the photo Id from here, in order to delete, without creating a delete page (REMEMBER TO COPY OUT THESE FILES INCASE SHIT GOES DOWN).

    response.render("admin/updategallerypage", { locals, photos, layout: adminLayout, currentRoute: "/dashboard" } );
  } catch (error) {
    console.log(error);
  }

} );

// "update gallery" single photo update page, post method
router.post("/updategallerypage/:id", authMiddleware, async (request, response) => {
  try {
    let galleryImageId = request.params.id;
    let galleryImageFile;
    let galleryImageUploadPath;
    let newGalleryImageName;

    if(!request.files || Object.keys(request.files).length === 0){
      console.log("File uploaded unsuccessful.");
    } else {
      fs.unlinkSync("./public/img/uploads/gallerypage/" + request.body.oldimage); // to remove the old image from the folder
      galleryImageFile = request.files.galleryimage;
      newGalleryImageName = Date.now()+"_"+galleryImageFile.name;
      galleryImageUploadPath = require("path").resolve("./") + "/public/img/uploads/gallerypage/" + newGalleryImageName;

      galleryImageFile.mv(galleryImageUploadPath, function(error){
        if(error) return response.satus(500).send(error);
      } )
    }

    const updateGalleryphoto = {
      galleryimage: newGalleryImageName,
      galleryimagecaption: request.body.galleryimagecaption,
      updatedAt: Date.now()
    };

    const data = await Galleryphoto.findById(galleryImageId);

    await Galleryphoto.findByIdAndUpdate(galleryImageId, updateGalleryphoto);
    
    response.redirect( `/updategallerypage/${galleryImageId}`);
  } catch (error) {
    console.log(error);
    response.redirect(`/updategallerypage/${galleryImageId}`);
  }

} );

// "delete photo" page, get method
//TODO try exploiting the "single photo" route above.
router.get("/deletegalleryimage/:id", authMiddleware, async(request, response) => {
  try {
    
    const locals = {
      title: "Delete Photo",
      keywords: "AGO, Kator, Celdric, Official Website, Delete Gallery, Pictures, Photos, Gallery Photos",
      description: "AGO Kator Celdric Official Website Deleteing Gallery Photos",
      author: "AGO SOO McAGO"
    };

    let galleryImageId = request.params.id;
    const photo = await Galleryphoto.findById(galleryImageId);

    response.render("admin/deletegalleryimage", { locals, photo, layout: adminLayout, currentRoute: "/dashboard" } );

  } catch (error) {
    console.log(error);
  }
} );

// "delete photo", post method
router.post("/deletegalleryimage/:id", authMiddleware, async (request, response) => {
  try {
    const galleryImageId = request.params.id;
    
    const deletingPhoto = await Galleryphoto.findOneAndDelete( {_id: galleryImageId} ); // find the photo from the database

    const { galleryimage } = deletingPhoto;
    
    if (galleryimage) {
      const galleryImagePath = require("path").resolve("./") + "/public/img/uploads/gallerypage/" + galleryimage;
      fs.unlinkSync(galleryImagePath);
    } else {
      console.log("Gallery Image not deleted!");
    }

    response.redirect("/dashboard");
  } catch (error) {
    console.log(error + "Did not delete");
  }

} );

//! Admin logout, get method
router.get("/logout", (request, response) => {
  response.clearCookie("token");
  //res.json({ message: 'Logout successful.'}); /* create a page to display this message. */
  response.redirect("admin");
});

module.exports = router;