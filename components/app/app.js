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
                renderLists: function (list) {
                    return `<a class="list-group-item list-group-item-action fa fa-list-ul" data-name="${list}" role="tab"><span class="listName">${list}</span></a>`
                },
                renderTabs: function (tab) {
                    return `<div class="tab-pane" id="${tab}" data-name="${tab}" role="tabpanel"></div>`
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

            document.querySelector(".tab-content .tab-pane.active")
                .insertAdjacentHTML("afterbegin", `<li class="list-group-item list-group-item-light"><a>${date.name}</a></li>`);

            form.reset();

            setTimeout(function () {
                var alert = document.createElement("div");
                alert.classList.add("alert");
                alert.classList.add("alert-success");
                alert.innerText = "Запись успешно добавлена!";
                document.querySelector(".container-fluid").insertAdjacentElement("afterbegin", alert);
            }, 500);
            setTimeout(function () {
                document.querySelector(".alert.alert-success").remove();
            }, 2000)

        },
        createCategory: async function (event) {

            event.preventDefault();

            var categoryName = document.querySelector("#creatList");
            let tabNameLength = document.querySelector(`.tab-content .tab-pane[id="${categoryName.value}"]`);

            if (categoryName.value && isNaN(categoryName.value) && tabNameLength === null) {

                await add(categoryName.value, `/Tasks/${categoryName.value}.json`);

                let dateTab = TaskForm.TabDate();

                dateTab.listContainer.insertAdjacentHTML("beforeend", dateTab.renderLists(categoryName.value));
                dateTab.tabContainer.insertAdjacentHTML("beforeend", dateTab.renderTabs(categoryName.value));


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
                var TaskListKeys = Object.keys(dataTask);

                TaskListKeys.forEach((value) => {

                    let dateTab = TaskForm.TabDate();

                    dateTab.listContainer.insertAdjacentHTML("beforeend", dateTab.renderLists(value));
                    dateTab.tabContainer.insertAdjacentHTML("beforeend", dateTab.renderTabs(value));
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