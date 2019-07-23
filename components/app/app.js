"use strict";
(function () {
    var form = document.forms.namedItem("task");
    var createListForm = document.forms.namedItem("createListForm");
    var listGroup = document.querySelector('.list-group');

    var TaskForm = {
        jsonIsLoaded: false,

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
        },
        createCategory: async function (event) {

            event.preventDefault();

            let categoryName = document.querySelector("#creatList");
            let categoryNameValue= document.querySelector("#creatList").value.toString().trim();
            let tabNameLength = document.querySelector(`.tab-content .tab-pane[id="${categoryNameValue}"]`);
            let listLength = document.querySelectorAll("#myList a").length;


            if (categoryNameValue && isNaN(categoryNameValue) && tabNameLength === null) {

                await add(categoryNameValue, `/Tasks/${categoryNameValue}.json`);

                let dateTab = TaskForm.TabDate();

                dateTab.listContainer.insertAdjacentHTML("beforeend", dateTab.renderLists(categoryNameValue, listLength, 0));
                dateTab.tabContainer.insertAdjacentHTML("beforeend", dateTab.renderTabs(categoryNameValue, listLength));


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

                    dateTab.listContainer.insertAdjacentHTML("beforeend", dateTab.renderLists(value, index, array[index].tasksCount));
                    dateTab.tabContainer.insertAdjacentHTML("beforeend", dateTab.renderTabs(value, index));

                    document.querySelector("#myList a:first-child").classList.add("active");
                    document.querySelector(".tab-content .tab-pane:first-child").classList.add("active");
                });

                for (let i = 0; i < arr.length; i++) {
                    var taskObjects = arr[i];

                    for (var key in taskObjects) {
                        var template = `<li class="list-group-item list-group-item-light"><a>${taskObjects[key].name}</a></li>`;
                        document.querySelectorAll(`.tab-content .tab-pane`).forEach(item => {
                            if (item.dataset.name === `${taskObjects[key].categoryName}`) {
                                item.insertAdjacentHTML("beforeend", template);
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

            document.querySelectorAll('.tab-pane, .list-group-item').forEach(el => {
                el.classList.remove("active");
            });

            link.classList.add("active");
            document.querySelector(`.tab-pane[id=${linkName}]`).classList.add("active");
            document.querySelector(".categoriesName").innerHTML = linkName;

        },
    };


    window.addEventListener("load", TaskForm.getTasks);
    createListForm.addEventListener("submit", TaskForm.createCategory);
    listGroup.addEventListener('click', TaskForm.showTab);
    form.addEventListener("submit", TaskForm.createTask);


})();