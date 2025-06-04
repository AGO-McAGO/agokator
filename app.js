"use strict";


require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const methodOverride = require("method-override"); // required to enable the use of "PUT" for updating data, and "DELETE" for deleting data from the database.
const cookieParser = require("cookie-parser"); // to enable storing sessions (login and logout).
const session = require("express-session");
const MongoStore = require("connect-mongo");

const connectDB = require("./server/config/database");

const { isActiveRoute } = require("./server/helpers/routeHelpers"); // import the routeHelpers.

const app = express();
const PORT = 5000 || process.env.PORT;

connectDB();

// setup to enable passing data through forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method")); // override called here to enable "PUT" and "DELETE" methods.

app.use( session( {
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create( { mongoUrl: process.env.MONGODB_URI, dbName: "agokator", useNewUrlParser: true, useUnifiedTopology: true} )
} ) );

app.use(fileUpload());

app.use( express.static("public") );

app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.locals.isActiveRoute = isActiveRoute; // create the "isActiveRoute" global variable to enable the usage.

app.use("/", require("./server/routes/pages") );
app.use('/', require("./server/routes/admin")); // admin route

app.listen( PORT, () => console.log(`Listening on port ${PORT}`) );