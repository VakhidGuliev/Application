"use strict";

var link = document.querySelector("#navbarDropdownMenuLink");

function subMenu(el) {
    el.classList.toggle("show");
}

link.addEventListener("click",function (e) {
    e.preventDefault();
    subMenu(document.querySelector(".dropdown-menu"))
});