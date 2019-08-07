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
const database = firebase.database();

auth.onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        userId.push(user.uid);

        let userInfo = database.ref(`Users/${user.uid}/userInfo`);

        document.querySelector(".user-name").innerHTML = user.email;
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
                                    <span class="task-name">${task.name}</span>
                                    <span class="deleteTask"><i class="fa fa-trash btn_delete"></i></span>
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


var taskForm = document.forms.namedItem("task");
var editTaskForm = document.forms.namedItem("EditTask");
var createListForm = document.forms.namedItem("createListForm");
var searchForm = document.forms.namedItem("search_form");
var listGroup = document.querySelector('.list-group');
var tabContent = document.querySelector(".tab-content");

const userId = [];

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
                                <span class="listName"><i class="fa fa-list-ul"></i> ${list} </span>
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
    findTask: function () {

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
                                <span class="task-name">${currentTaskName}</span>
                                <span class="deleteTask"><i class="fa fa-trash btn_delete"></i></span>
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

        document.querySelector(".categoriesName").innerHTML = "Found tasks";
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
    createCategory: function (e) {
        e.preventDefault();

        let category = {
            categoryName: document.querySelector("#creatList").value.toString().trim(),
        };

        let ref = database.ref(`Users/${userId[0]}/Tasks`);
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
        taskName.innerHTML = currentTaskName;
        taskNote.innerHTML = currentTaskNote;
        taskName.setAttribute("data-key", currentTaskKey);
    },
    saveTaskChanges: function (e) {
        e.preventDefault();

        let formData = Task.formData();
        let taskKey = document.querySelector("#taskName").getAttribute("data-key");
        let note = document.querySelector("#note").value;
        let ref = database.ref(`Users/${userId[0]}/Tasks/${formData.parentCategory}/${taskKey}`);
        ref.update({
            note: note,
        }).then(r => r);

        $('#fullHeightModalRight').modal('hide');
        editTaskForm.reset();
    }
};


//listeners
listGroup.addEventListener("click", Task.showTab);
createListForm.addEventListener("submit", Task.createCategory);
taskForm.addEventListener("submit", Task.addTask);
editTaskForm.addEventListener("submit", Task.saveTaskChanges);
tabContent.addEventListener("click", Task.showTaskModal);
document.querySelector(".input-group-append").addEventListener("click", Task.findTask);
document.querySelector(".tab-content").addEventListener("click", Task.deleteTask);