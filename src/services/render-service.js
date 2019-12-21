import ModalService from "./modal-service";

class RenderService {
    constructor(){}

    renderCategory(){
        let category = {
            categoryName: document.querySelector("#createList").value.toString().trim(),
        };

        const listForm = document.querySelector("#ListForm");
        let categoryName = document.querySelector("#createList");
        let tabNameLength = document.querySelector(`.tab-content .tab-pane[id="${category.categoryName}"]`);
        let listLength = document.querySelectorAll("#myList a").length;
        const lastId = parseInt($(".list-group a:last-child").attr("data-id"));
        const newId = (lastId + 1).toString();


        if (category.categoryName && isNaN(category.categoryName) && tabNameLength === null) {

            let Tab = new ModalService().Tabs();

            // render
            Tab.listContainer.insertAdjacentHTML("beforeend", Tab.renderLists(category.categoryName, newId, 0));
            Tab.tabContainer.insertAdjacentHTML("beforeend", Tab.renderTabs(category.categoryName, newId));

            //delete active class
            Tab.listContainer.querySelectorAll("a").forEach(value => value.classList.remove("active"));
            Tab.tabContainer.querySelectorAll(".tab-pane").forEach(value => value.classList.remove("active"));

            //add active class created category
            Tab.listContainer.querySelector(`a[data-name=${category.categoryName}]`).classList.add("active");
            Tab.tabContainer.querySelector(`.tab-pane[data-name=${category.categoryName}]`).classList.add("active");

            document.querySelector(".categoriesName").innerHTML = category.categoryName;

            // valid categoryName
            categoryName.classList.remove("is-invalid");
            categoryName.classList.add("is-valid");

            listForm.reset();

            $(".valid-feedback").html("");
            $(".invalid-feedback").html("");

            $('#ListModal').modal('hide');
        } else {
            categoryName.classList.add("is-invalid");
            return false;
        }
    }
}

export  default  RenderService;