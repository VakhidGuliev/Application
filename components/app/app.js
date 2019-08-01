"use strict";

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
var database = firebase.database();
var ref = database.ref("Tasks");


auth.onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        document.querySelector(".user-name").innerHTML = user.email;
        // ...
    } else {
        // User is signed out.
        document.querySelector(".user-name").innerHTML = "";
        const authUrl = "../auth/auth.html";
        window.open(authUrl,"_self");
    }
});

var signOut = document.querySelector("#signOut");
signOut.addEventListener("click", e=> {
   auth.signOut().then(response=> console.log(response)).catch(e=> console.log(e.message))
});



var taskForm = document.forms.namedItem("task");
var createListForm = document.forms.namedItem("createListForm");
var searchForm = document.forms.namedItem("search_form");
var listGroup = document.querySelector('.list-group');

var Task = {
    taskNames: [],
    formData: function () {
        return {
            name: taskForm.elements.namedItem("name").value,
            parentCategory: Task.getCategoryName(),
            Date: new Date().toLocaleDateString(),
            Time: new Date().toLocaleTimeString(),
        };
    },
    Tabs: function () {
        return {
            listContainer: document.querySelector("#myList"),
            tabContainer: document.querySelector(".tab-content"),
            renderLists: function (list, index, array) {
                return `<a class="list-group-item list-group-item-action" data-name="${list}" data-index="${index}" role="tab">
                                <i class="fa fa-list-ul"></i>
                                <span class="listName">${list}</span>
                                <span class="listCount badge badge-primary badge-pill">${array}</span>
                            </a>`
            },
            renderTabs: function (tab, index) {
                return `<div class="tab-pane" id="${tab}" data-name="${tab}" data-index="${index}" role="tabpanel"></div>`
            }
        };
    },
    getCategoryName: function () {
        let categoriesName;
        let tabName = document.querySelectorAll(".tab-content .tab-pane");

        for (let i = 0; i < tabName.length; i++) {
            if (tabName[i].classList.contains("active")) {
                categoriesName = tabName[i].id;
            }
        }
        return categoriesName;
    },
    addTask: function (e) {
        e.preventDefault();

        let formDate = Task.formData();
        let Tab = Task.Tabs();

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
    getTask: function (data) {
        var Tab = Task.Tabs();
        var TaskObject = data.val();
        var promise = fbTransformToArray(TaskObject);

        promise.then(function (arr) {
            var objectKeys = Object.keys(TaskObject);

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

            for (var categoriesKey in TaskObject) {
                var category = TaskObject[categoriesKey];

                for (var tasksKey in category) {
                    var task = category[tasksKey];

                    document.querySelectorAll(`.tab-content .tab-pane`).forEach((value, key, parent) => {
                        if (value.dataset.name === `${task.parentCategory}`) {
                            key = tasksKey;
                            var template = `<li class="list-group-item list-group-item-light" data-key="${key}">
                                    <span>
                                       <input type="checkbox" style="width: auto">
                                       <a>${task.name}</a>
                                    </span>
                                       <span class="deleteTask"><i class="fa fa-trash btn_delete" aria-hidden="true"></i></span>
                                    </li>`;
                            value.insertAdjacentHTML("beforeend", template);
                            Task.taskNames.push(task.name);
                        }
                    });
                }
            }
        }).catch(function (e) {
            console.log(e.message)
        });
    },
    findTask: function () {

        let valueSearch = document.querySelector("#searchTask").value;
        var findTask = Task.taskNames.slice().find(value => value === valueSearch);
        let Tab = Task.Tabs();
        let template = `<div class="searchList"><li class="list-group-item list-group-item-light" data-name="${findTask}"><a>${findTask}</a></li></div>`;
        var searchList = Tab.tabContainer.querySelector(".searchList");
        // let compareReg = template.match(`${findTask}`)[0];


        document.querySelector(".AddTask").style.display = "none";
        Tab.tabContainer.querySelectorAll(".tab-pane.active").forEach(value => value.classList.add("hide"));

        if (findTask !== undefined) {
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

        document.querySelector(".categoriesName").innerHTML = "Found tasks";
        searchForm.reset();
    },
    deleteTask: function (e) {
        if (e.target.classList.contains("btn_delete")) {
            var formData = Task.formData();
            var taskId = e.target.parentElement.parentElement.getAttribute("data-key");

            var firebaseRef = database.ref("/Tasks").child(`${formData.parentCategory}`).child(`${taskId}`);
            firebaseRef.remove().then(value => value).catch(e => console.log(e.message))
        }
    },
    createCategory: function (e) {
        e.preventDefault();

        let category = {
            categoryName: document.querySelector("#creatList").value.toString().trim(),
        };
        ref.child(`${category.categoryName}`).set(category).then(response => response);


        let categoryName = document.querySelector("#creatList");
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

            createListForm.reset();

            $('#creteListModal').modal('hide');
        } else {
            categoryName.classList.add("is-invalid");
        }
    },
    showTab: function (e) {

        var link = e.target;

        if (!link.classList.contains('list-group-item')) {
            return;
        }

        var linkName = link.dataset.name;
        var listSearch = document.querySelector(".tab-content .searchList");

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

    },
};


//listeners
ref.on("value", Task.getTask);
listGroup.addEventListener("click", Task.showTab);
createListForm.addEventListener("submit", Task.createCategory);
taskForm.addEventListener("submit", Task.addTask);
document.querySelector(".input-group-append").addEventListener("click", Task.findTask);
document.querySelector(".tab-content").addEventListener("click", Task.deleteTask);