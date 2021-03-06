import jQuery from "jquery";
import CategoryController from "./controllers/category-controller"
import ApiService from "./services/api-service";
import FirebaseService from "./services/firebase-service";

window.$ = window.jQuery = jQuery;


//variables
const btnCreateList = document.querySelector("#showCreateList");
const listGroup = document.querySelector('.list-group');
const tabContent = document.querySelector(".tab-content");

//controllers
const categoryController = new CategoryController();


//load Data

$(function () {
    new FirebaseService().init();
    new ApiService().getData();
});

//listeners
//1) categories
btnCreateList.addEventListener("click", categoryController.CreateCategory);
// listGroup.addEventListener("click", categoryController.EditCategory);
listGroup.addEventListener("click", categoryController.switchCategory);
