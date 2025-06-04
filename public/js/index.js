
"use strict";


const navButton = document.querySelector(".navbutton"); // grabs the burger button.
const nav = document.querySelector("nav"); // grabs the nav element.

navButton.addEventListener( "click", () => {
    navButton.classList.toggle("open");
    nav.classList.toggle("open");
} );