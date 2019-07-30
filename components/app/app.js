"use strict";
(function () {

    // Your web app's Firebase configuration
    var firebaseConfig = {
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

    var database = firebase.database();


    var form = document.forms.namedItem("task");
    var searchForm = document.forms.namedItem("search_form");
    var createListForm = document.forms.namedItem("createListForm");
    var listGroup = document.querySelector('.list-group');


    var TaskForm = {
        jsonIsLoaded: false,
        Tasks: [],
        keys: [],
        taskKeys: [],
        isFind: false,

        date: function () {
            var formData = {
                name: form.elements.namedItem("name").value,
                categoryName: TaskForm.getCategoryName(),
                Date: new Date().toLocaleDateString(),
                Time: new Date().toLocaleTimeString(),
            };

            return formData;
        },
        TabDate: function () {
            var tabData = {
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
            return tabData;
        },
        getCategoryName: function () {
            var categoriesName;
            let tabName = document.querySelectorAll(".tab-content .tab-pane");

            for (let i = 0; i < tabName.length; i++) {
                if (tabName[i].classList.contains("active")) {
                    categoriesName = tabName[i].id;
                }
            }
            return categoriesName;
        },
        createTask: async function (event) {
            event.preventDefault();

            let date = TaskForm.date();
            let dateTab = TaskForm.TabDate();

            if (dateTab.listContainer.children.length !== 0 && date.name.trim() !== "") {
                await add(date, `/Tasks/${date.categoryName}.json`);

                form.reset();
                await TaskForm.getTasks();

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
        createCategory: async function (event) {

            event.preventDefault();

            let categoryName = document.querySelector("#creatList");
            let categoryNameValue = document.querySelector("#creatList").value.toString().trim();
            let tabNameLength = document.querySelector(`.tab-content .tab-pane[id="${categoryNameValue}"]`);
            let listLength = document.querySelectorAll("#myList a").length;


            if (categoryNameValue && isNaN(categoryNameValue) && tabNameLength === null) {

                await add(categoryNameValue, `/Tasks/${categoryNameValue}.json`);

                let dateTab = TaskForm.TabDate();

                // rendering
                dateTab.listContainer.insertAdjacentHTML("beforeend", dateTab.renderLists(categoryNameValue, listLength, 0));
                dateTab.tabContainer.insertAdjacentHTML("beforeend", dateTab.renderTabs(categoryNameValue, listLength));

                //delete active class
                dateTab.listContainer.querySelectorAll("a").forEach(value => value.classList.remove("active"));
                dateTab.tabContainer.querySelectorAll(".tab-pane").forEach(value => value.classList.remove("active"));

                //add active class created category
                dateTab.listContainer.querySelector(`a[data-name=${categoryNameValue}]`).classList.add("active");
                dateTab.tabContainer.querySelector(`.tab-pane[data-name=${categoryNameValue}]`).classList.add("active");

                document.querySelector(".categoriesName").innerHTML = categoryNameValue;

                // valid categoryName
                categoryName.classList.remove("is-invalid");
                categoryName.classList.add("is-valid");

                createListForm.reset();

                $('#creteListModal').modal('hide');
            } else {
                categoryName.classList.add("is-invalid");
            }
        },
        getTasks: async function () {
            let dataTask = await get("/Tasks.json");
            let promise = fbTransformToArray(dataTask);


            promise.then(function (arr) {
                TaskForm.jsonIsLoaded = true;

                //Update database
                document.querySelector("#myList").innerHTML = "";
                document.querySelector(".tab-content").innerHTML = "";


                //rendering
                var TaskListKeys = Object.keys(dataTask);
                TaskListKeys.forEach((value, index, array) => {
                    let dateTab = TaskForm.TabDate();

                    array = arr;

                    TaskForm.keys.unshift(array[index].keys);

                    dateTab.listContainer.insertAdjacentHTML("afterbegin", dateTab.renderLists(value, index, array[index].tasksCount));
                    dateTab.tabContainer.insertAdjacentHTML("afterbegin", dateTab.renderTabs(value, index));

                    dateTab.listContainer.querySelectorAll("a").forEach(value => value.classList.remove("active"));
                    dateTab.tabContainer.querySelectorAll(".tab-pane").forEach(value => value.classList.remove("active"));

                    document.querySelector("#myList a:first-child").classList.add("active");
                    document.querySelector(".tab-content .tab-pane:first-child").classList.add("active");

                    document.querySelector(".categoriesName").innerHTML = value;
                });


                for (let i = 0; i < TaskForm.keys.length; i++) {
                    var categoryKey = TaskForm.keys[i];
                    for (let j = 0; j < categoryKey.length; j++) {
                        TaskForm.taskKeys.push(categoryKey[j])
                    }
                }


                for (let i = 0; i < arr.length; i++) {
                    var taskObjects = arr[i];

                    for (var key in taskObjects) {
                        var template = `<li class="list-group-item list-group-item-light">
                            <span>
                               <input type="checkbox" style="width: auto">
                               <a>${taskObjects[key].name}</a>
                            </span>
                               <span class="deleteTask"><i class="fa fa-trash btn_delete" aria-hidden="true"></i></span>
                            </li>`;
                        document.querySelectorAll(`.tab-content .tab-pane`).forEach(item => {
                            if (item.dataset.name === `${taskObjects[key].categoryName}`) {
                                item.insertAdjacentHTML("beforeend", template);
                                TaskForm.Tasks.push(taskObjects[key].name);
                            }
                        });
                    }
                }
                document.querySelectorAll(".list-group-item.list-group-item-light").forEach((value, key1, parent) => {
                    value.setAttribute("data-key", `${TaskForm.taskKeys[key1]}`)
                })


            }).catch(e => {
                console.log(e.message)
            });
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
        findTask: function () {

            let valueSearch = document.querySelector("#searchTask").value;
            var findTask = TaskForm.Tasks.slice().find(value => value === valueSearch);
            let tabDate = TaskForm.TabDate();
            let template = `<div class="searchList"><li class="list-group-item list-group-item-light" data-name="${findTask}"><a>${findTask}</a></li></div>`;
            var searchList = tabDate.tabContainer.querySelector(".searchList");
            // let compareReg = template.match(`${findTask}`)[0];


            document.querySelector(".AddTask").style.display = "none";
            tabDate.tabContainer.querySelectorAll(".tab-pane.active").forEach(value => value.classList.add("hide"));


            if (findTask !== undefined) {
                if (searchList !== null) {
                    searchList.innerHTML = "";
                }
                tabDate.tabContainer.insertAdjacentHTML("afterbegin", template);
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
                //delete task
                var date = TaskForm.date();
                var taskId = e.target.parentElement.parentElement.getAttribute("data-key");
                var firebaseRef = database.ref("/Tasks").child(`${date.categoryName}`).child(`${taskId}`);
                firebaseRef.remove().then(function () {
                    console.log("removed");
                    // setTimeout(function () {
                    //     TaskForm.getTasks();
                    // },1000)
                }).catch(function (e) {
                    console.log(e.message);
                })
            }
        }
    };


    document.querySelector(".input-group-append").addEventListener("click", TaskForm.findTask);

    window.addEventListener("load", TaskForm.getTasks);
    createListForm.addEventListener("submit", TaskForm.createCategory);
    listGroup.addEventListener('click', TaskForm.showTab);
    form.addEventListener("submit", TaskForm.createTask);

    document.querySelector(".tab-content").addEventListener("click", TaskForm.deleteTask);


})();