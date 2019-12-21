import CategoryController from "./controllers/category-controller"
import FirebaseService from "./services/firebase-service";


//variables
const btnCreateList = document.querySelector("#showCreateList");
const listGroup = document.querySelector('.list-group');
const tabContent = document.querySelector(".tab-content");

//userId
export const userId = new FirebaseService().init();


//controllers
const categoryController = new CategoryController();

$(function () {
    // new FirebaseService().getTasks();
});


//listeners
//1) categories
btnCreateList.addEventListener("click", categoryController.CreateCategory);
listGroup.addEventListener("click", categoryController.EditCategory);
listGroup.addEventListener("click", categoryController.switchCategory);