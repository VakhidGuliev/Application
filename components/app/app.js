"use strict";
/*authentication*/
function fireBaseInit() {
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDqclOHPqTzVU3cmqryDJ7YGuCbYNRNGtk",
        authDomain: "application-c0501.firebaseapp.com",
        databaseURL: "https://application-c0501.firebaseio.com",
        projectId: "application-c0501",
        storageBucket: "application-c0501.appspot.com",
        messagingSenderId: "53230773832",
        appId: "1:53230773832:web:87f8de8c0d4bdfce"
    };
// Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}

fireBaseInit();

const auth = firebase.auth();
const database = firebase.database();
const userName = document.querySelector(".user-name");

auth.onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        userId.push(user.uid);

        userName.innerHTML = user.email;
        let ref = database.ref(`Users/${user.uid}/Tasks`);
        ref.on("value", getTask);

        function getTask(data) {
            var Tab = Task.Tabs();
            var TaskObject = data.val();
            var promise = fbTransformToArray(TaskObject);

            promise.then(function (arr) {
                let objectKeys = Object.keys(TaskObject);

                //Update database
                document.querySelector("#myList").innerHTML = "";
                document.querySelector(".tab-content").innerHTML = "";

                objectKeys.forEach((value, index, array) => {
                    array = arr;

                    Tab.listContainer.insertAdjacentHTML("beforeend", Tab.renderLists(value, index, array[index].tasksCount));
                    Tab.tabContainer.insertAdjacentHTML("beforeend", Tab.renderTabs(value, index));

                    Tab.listContainer.querySelectorAll("a").forEach(value => value.classList.remove("active"));
                    Tab.tabContainer.querySelectorAll(".tab-pane").forEach(value => value.classList.remove("active"));

                    document.querySelector("#myList a:first-child").classList.add("active");
                    document.querySelector(".tab-content .tab-pane:first-child").classList.add("active");

                    document.querySelector(".categoriesName").innerHTML = array[0].categoryName;
                });


                for (let categoriesKey in TaskObject) {

                    let category = TaskObject[categoriesKey];

                    for (let tasksKey in category) {
                        let task = category[tasksKey];

                        document.querySelectorAll(`.tab-content .tab-pane`).forEach((value, key, parent) => {
                            if (value.dataset.name === `${task.parentCategory}`) {
                                key = tasksKey;
                                let template = `
                                    <li class="task-item list-group-item list-group-item-light" data-value="${task.name}" data-note="${task.note === undefined ? "" : task.note}" data-key="${key}">
                                    <input type="checkbox" class="isMarked" title="Mark as completed">
                                    <span class="task-name" title="Edit Task">${task.name}</span>
                                    <span class="deleteTask" title="Delete Task"><i class="fa fa-trash btn_delete"></i></span>
                                    </li>`;

                                value.insertAdjacentHTML("beforeend", template);
                                Task.taskNames.push(task.name);
                            }
                        });
                    }
                }
            }).catch(e=> console.log(e.message));
        }
    } else {
        // User is signed out.
        window.open("../auth/auth.html", "_self");
    }
});

var signOut = document.querySelector("#signOut");
signOut.addEventListener("click", e => {
    auth.signOut().then(response => console.log(response)).catch(e => console.log(e.message))
});
/*authentication and get data off database*/


//variables
var taskForm = document.forms.namedItem("task");
var editTaskForm = document.forms.namedItem("EditTask");
var listForm = document.querySelector("#ListForm");
var searchForm = document.forms.namedItem("search_form");
var listGroup = document.querySelector('.list-group');
var tabContent = document.querySelector(".tab-content");
var btnShowCreateList = document.querySelector("#showCreateList");
var findTask = document.querySelector(".findTask");

const userId = [];

//Main object Task
var Task = {
    taskNames: [],
    formData: function (e) {
        return {
            name: taskForm.elements.namedItem("name").value,
            parentCategory: Task.getCategoryName(),
            Date: new Date().toLocaleDateString(),
            Time: new Date().toLocaleTimeString(),
        };
    },
    getCategoryName: function (e) {
        let categoriesName;
        let tabName = document.querySelectorAll(".tab-content .tab-pane");

        for (let i = 0; i < tabName.length; i++) {
            if (tabName[i].classList.contains("active")) {
                categoriesName = tabName[i].id;
            }
        }
        return categoriesName;
    },

    createCategory: function (e) {
        e.preventDefault();

        let btnCreate = e.target;

        if (!btnCreate.classList.contains("create")) {
            return;
        }

        let category = {
            categoryName: document.querySelector("#createList").value.toString().trim(),
        };

        let ref = database.ref(`Users/${userId[0]}/Tasks`);
        ref.child(`${category.categoryName}`).set(category).then(response => response);

        let categoryName = document.querySelector("#createList");
        let tabNameLength = document.querySelector(`.tab-content .tab-pane[id="${category.categoryName}"]`);
        let listLength = document.querySelectorAll("#myList a").length;


        if (category.categoryName && isNaN(category.categoryName) && tabNameLength === null) {

            let Tab = Task.Tabs();

            // render
            Tab.listContainer.insertAdjacentHTML("beforeend", Tab.renderLists(category.categoryName, listLength, 0));
            Tab.tabContainer.insertAdjacentHTML("beforeend", Tab.renderTabs(category.categoryName, listLength));

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

            ListForm.reset();

            $('#ListModal').modal('hide');
        } else {
            categoryName.classList.add("is-invalid");
        }
    },
    editCategory: function (e) {
        e.preventDefault();

        let btnEditSave = e.target;

        if (!btnEditSave.classList.contains("save")) {
            return;
        }
        let category = {
            categoryName: document.querySelector("#editList").value.toString().trim(),
        };
        let ref = database.ref(`Users/${userId[0]}`);
        let key = ref.child(`${category.categoryName}`).key;

        console.log("edit task");

        $('#ListModal').modal('hide');
    },
    deleteCategory: function (e) {
        e.preventDefault();
        let btnDelete = e.target;

        if (!btnDelete.classList.contains("btn-delete")) {
            return;
        }

        let category = {
            categoryName: document.querySelector("#editList").value.toString().trim(),
        };

        let ref = database.ref(`Users/${userId[0]}/Tasks`);
        ref.child(`${category.categoryName}`).remove().then(r => r).catch(e => console.log(e.message));

        $('#ListModal').modal('hide');
        listGroup.innerHTML = "";
    },

    addTask: function (e) {
        e.preventDefault();

        let formDate = Task.formData();
        let Tab = Task.Tabs();
        let ref = database.ref(`Users/${userId[0]}/Tasks`);


        if (Tab.listContainer.children.length !== 0 && formDate.name.trim() !== "") {
            ref.child(`${formDate.parentCategory}`).push(formDate);

            taskForm.reset();

            setTimeout(function () {
                const alert = document.createElement("div");
                alert.classList.add("alert");
                alert.classList.add("alert-success");
                alert.innerText = "Запись успешно добавлена!";
                document.querySelector(".tab-content").insertAdjacentElement("afterbegin", alert);
            }, 500);
            setTimeout(function () {
                document.querySelector(".alert.alert-success").remove();
            }, 2000)
        }
        return false;
    },
    editTask: function (e) {
        e.preventDefault();

        let formData = Task.formData();
        let taskKey = document.querySelector("#taskName").getAttribute("data-key");
        let note = document.querySelector("#note").value;
        let taskName = document.querySelector("#taskName").value;
        let ref = database.ref(`Users/${userId[0]}/Tasks/${formData.parentCategory}/${taskKey}`);
        ref.update({
            name: taskName,
            note: note,
        }).then(r => r);

        $('#fullHeightModalRight').modal('hide');
        editTaskForm.reset();
    },
    findTask: function (e) {

        let valueSearch = document.querySelector("#searchTask").value;
        let findTask = Task.taskNames.slice().find(value => value === valueSearch);
        let Tab = Task.Tabs();
        let searchList = Tab.tabContainer.querySelector(".searchList");


        document.querySelector(".AddTask").style.display = "none";
        Tab.tabContainer.querySelectorAll(".tab-pane.active").forEach(value => value.classList.add("hide"));

        if (findTask !== undefined) {

            let currentTaskItem = document.querySelector(`li.task-item[data-value='${findTask}']`);
            let currentTaskName = currentTaskItem.getAttribute("data-value");
            let currentTaskKey = currentTaskItem.getAttribute("data-key");
            let currentTaskNote = currentTaskItem.getAttribute("data-note");

            let template = `<div class="searchList">
                            <li class="task-item list-group-item list-group-item-light" data-value="${findTask}" data-note="${currentTaskNote}" data-key="${currentTaskKey}">
                                    <input type="checkbox" class="isMarked" title="Mark as completed">
                                    <span class="task-name" title="Edit Task">${currentTaskName}</span>
                                    <span class="deleteTask" title="Delete Task"><i class="fa fa-trash btn_delete"></i></span>
                            </li>
                        </div>`;

            if (searchList !== null) {
                searchList.innerHTML = "";
            }
            Tab.tabContainer.insertAdjacentHTML("afterbegin", template);
        } else {
            if (searchList !== null) {
                searchList.innerHTML = "";
            }
            setTimeout(function () {
                const alert = document.createElement("div");
                alert.classList.add("alert");
                alert.classList.add("alert-danger");
                alert.innerText = "Task not found!";

                document.querySelector(".tab-content").insertAdjacentElement("afterbegin", alert);
            }, 500);
            setTimeout(function () {
                document.querySelector(".alert.alert-danger").remove();
            }, 2000)

        }

        document.querySelector(".categoriesName").innerHTML = "Found task";
        searchForm.reset();
    },
    deleteTask: function (e) {
        if (e.target.classList.contains("btn_delete")) {
            e.stopPropagation();
            var formData = Task.formData();
            var taskId = e.target.parentElement.parentElement.getAttribute("data-key");

            let ref = database.ref(`Users/${userId}/Tasks`).child(`${formData.parentCategory}`).child(`${taskId}`);
            ref.remove().then(value => value).catch(e => console.log(e.message))
        }
    },

    Tabs: function (e) {
        return {
            listContainer: document.querySelector("#myList"),
            tabContainer: document.querySelector(".tab-content"),
            renderLists: function (list, index, array) {
                return `<a class="list-group-item list-group-item-action" data-name="${list}" data-index="${index}" role="tab">
                                <span class="listName"><i class="fa fa-list-ul" style="position:relative;right:5px;"></i>${list}</span>
                                <span class="listCount badge badge-primary" title="Task count" style="align-self:center">${array}</span>
                                <span class="editList" title="List options"><i class="fa fa-edit"></i></span>
                            </a>`
            },
            renderTabs: function (tab, index) {
                return `<div class="tab-pane" id="${tab}" data-name="${tab}" data-index="${index}" role="tabpanel"></div>`
            }
        };
    },
    showTab: function (e) {
        let link = e.target;

        if (!link.classList.contains('list-group-item')) {
            return;
        }

        let linkName = link.dataset.name;
        let listSearch = document.querySelector(".tab-content .searchList");

        document.querySelectorAll('.tab-pane, .list-group-item').forEach(el => {
            el.classList.remove("active");
        });

        document.querySelectorAll(".tab-pane").forEach(value => value.classList.remove("hide"));
        document.querySelectorAll(".tab-pane.active").forEach(value => value.classList.add("show"));

        if (listSearch) {
            listSearch.remove();
        }


        link.classList.add("active");
        document.querySelector(`.tab-pane[id=${linkName}]`).classList.add("active");
        document.querySelector(".categoriesName").innerHTML = linkName;
        document.querySelector(".AddTask").style.display = "block";


    },
    showTaskModal: function (e) {
        let taskName = document.querySelector("#taskName");
        let taskNote = document.querySelector("#note");
        let currentTaskItem = e.target;
        let currentTaskName = currentTaskItem.getAttribute("data-value");
        let currentTaskKey = currentTaskItem.getAttribute("data-key");
        let currentTaskNote = currentTaskItem.getAttribute("data-note");

        if (!currentTaskItem.classList.contains('task-item')) {
            return;
        }

        $('#fullHeightModalRight').modal('show');
        taskName.value = currentTaskName;
        taskNote.innerHTML = currentTaskNote;
        taskName.setAttribute("data-key", currentTaskKey);
    },
    showCreateListModal: function (e) {

        $("#ListModal").modal("show");

        document.querySelector(".modal-footer .buttons").innerHTML = "";

        let buttons = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                       <button type="submit" class="btn btn-primary create">Save</button>`;
        document.querySelector(".modal-footer .buttons").insertAdjacentHTML("afterbegin", buttons);


        let modalTitle = document.querySelector("#ListModalTitle");
        let listName = ListForm.querySelector("input.listName");

        ListForm.name = "createListForm";
        modalTitle.innerHTML = "Create New List";
        listName.id = "createList";
        listName.setAttribute("value", "");
    },
    showEditListModal: function (e) {
        let link = e.target;
        let currentList = link.parentElement.parentElement;
        let currentListName = currentList.getAttribute("data-name");


        if (!link.classList.contains("fa-edit")) {
            return;
        }

        $("#ListModal").modal("show");

        let modalTitle = document.querySelector("#ListModalTitle");
        let listName = ListForm.querySelector("input.listName");

        ListForm.name = "editListForm";
        modalTitle.innerHTML = "Edit List";
        listName.id = "editList";
        listName.setAttribute("value", currentListName);

        document.querySelector(".modal-footer .buttons").innerHTML = "";

        let buttons = `<button type="submit" style="position:absolute;left:30px;" class="btn btn-danger btn-delete">Delete</button>
                       <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                       <button type="submit" class="btn btn-primary save">Save</button>`;
        document.querySelector(".modal-footer .buttons").insertAdjacentHTML("afterbegin", buttons);
    }
};


//listeners :
listGroup.addEventListener("click", Task.showTab);

//Modals
btnShowCreateList.addEventListener("click", Task.showCreateListModal);
listGroup.addEventListener("click", Task.showEditListModal);
tabContent.addEventListener("click", Task.showTaskModal);

//Categories
listForm.addEventListener("click", Task.createCategory);
listForm.addEventListener("click", Task.editCategory);
listForm.addEventListener("click", Task.deleteCategory);

//Tasks
taskForm.addEventListener("submit", Task.addTask);
editTaskForm.addEventListener("submit", Task.editTask);
tabContent.addEventListener("click", Task.deleteTask);
findTask.addEventListener("click", Task.findTask);






