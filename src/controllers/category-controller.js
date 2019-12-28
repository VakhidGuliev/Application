import ModalService from "../services/modal-service";
import FirebaseService from "../services/firebase-service";

class CategoryController {
    constructor() {}

    //create
    CreateCategory() {

        new ModalService().CreateCategory();

        const btnCreate = document.querySelector("button.create");

        if (!btnCreate.classList.contains("create")) {
            return;
        }

        btnCreate.addEventListener("click", (e) => {
            e.preventDefault();

            const categoryName = $("input[name='categoryName']").val();

            new FirebaseService().createCategory(categoryName)
        });
    }

    //delete,edit
    EditCategory(e) {

        new ModalService().EditCategory(e);

        let link = e.target;

        if (!link.classList.contains("fa-edit")) {
            return;
        }

        let btnEditSave = document.querySelector("button.save");
        let btnDelete = document.querySelector("button.btn-delete");


        btnDelete.addEventListener("click", (e) => {
            e.preventDefault();

            const id = $(".list-group-item-action.active").attr("data-id");

            new FirebaseService().deleteCategory(id);
        });
        btnEditSave.addEventListener("click", (e) => {

            e.preventDefault();


            const categoryName = $("input[name='Name']").val();
            const id = $(".list-group-item-action.active").attr("data-id");

            new FirebaseService().editCategory(id,categoryName);
        });

    }

    //switch
    switchCategory(e){
        new ModalService().showTab(e)
    }
}

export default CategoryController;