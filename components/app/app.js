"use strict";
(function () {
    var form = document.forms.namedItem("task");
    var searchForm = document.forms.namedItem("search_form");
    var createListForm = document.forms.namedItem("createListForm");
    var listGroup = document.querySelector('.list-group');

    var TaskForm = {
        jsonIsLoaded: false,
        Tasks: [],

        date: function () {
            var formData = {
                name: form.elements.namedItem("name").value,
                categoryName: TaskForm.getCategoryName(),
                Date: new Date().toLocaleDateString(),
                Time: new Date().toLocaleTimeString()
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
                TaskForm.getTasks();

                setTimeout(function () {
                    var alert = document.createElement("div");
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

                    dateTab.listContainer.insertAdjacentHTML("afterbegin", dateTab.renderLists(value, index, array[index].tasksCount));
                    dateTab.tabContainer.insertAdjacentHTML("afterbegin", dateTab.renderTabs(value, index));

                    dateTab.listContainer.querySelectorAll("a").forEach(value => value.classList.remove("active"));
                    dateTab.tabContainer.querySelectorAll(".tab-pane").forEach(value => value.classList.remove("active"));

                    document.querySelector("#myList a:first-child").classList.add("active");
                    document.querySelector(".tab-content .tab-pane:first-child").classList.add("active");

                    document.querySelector(".categoriesName").innerHTML = value;

                    console.log(value);
                });

                for (let i = 0; i < arr.length; i++) {
                    var taskObjects = arr[i];

                    for (var key in taskObjects) {
                        var template = `<li class="list-group-item list-group-item-light"><a>${taskObjects[key].name}</a></li>`;
                        document.querySelectorAll(`.tab-content .tab-pane`).forEach(item => {
                            if (item.dataset.name === `${taskObjects[key].categoryName}`) {
                                item.insertAdjacentHTML("beforeend", template);
                                TaskForm.Tasks.push(taskObjects[key].name);
                            }
                        });
                    }
                }
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

            if (listSearch){
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
            let template = `<div class="searchList"><li class="list-group-item list-group-item-light"><a>${findTask}</a></li></div>`;

            document.querySelector(".AddTask").style.display = "none";
            tabDate.tabContainer.querySelectorAll(".tab-pane.active").forEach(value => value.classList.add("hide"));

            if (findTask !== undefined){
                tabDate.tabContainer.insertAdjacentHTML("afterbegin", template);
            }
            document.querySelector(".categoriesName").innerHTML = "Found tasks";
            searchForm.reset();
        }
    };


    document.querySelector(".input-group-append").addEventListener("click",TaskForm.findTask);

    window.addEventListener("load", TaskForm.getTasks);
    createListForm.addEventListener("submit", TaskForm.createCategory);
    listGroup.addEventListener('click', TaskForm.showTab);
    form.addEventListener("submit", TaskForm.createTask);


})();