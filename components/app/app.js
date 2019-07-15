"use strict";
(function () {
    var form = document.forms.namedItem("task");
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
        createCategory: async function () {
            var categoryName = document.querySelector("#creatList").value;

            await add(categoryName, `/Tasks/${categoryName}.json`);

            var list = `<a class="list-group-item list-group-item-action" data-name="${categoryName}" role="tab">${categoryName}</a>`;
            var tab = `<div class="tab-pane" id="${categoryName}" role="tabpanel" data-name="${categoryName}"></div>`;

            document.querySelector("#myList").insertAdjacentHTML("beforeend", list);
            document.querySelector(".tab-content").insertAdjacentHTML("beforeend", tab);
        },
        getTasks: async function () {
            let dataTask = await get("/Tasks.json");
            let promise = fbTransformToArray(dataTask);

            let tabName = document.querySelectorAll(".tab-content .tab-pane");
            var TaskListKeys = Object.keys(dataTask);

            TaskListKeys.forEach((value, index) => {
                if (value !== tabName[index].id) {
                    var tabList = `<a class="list-group-item list-group-item-action" data-name="${value}" role="tab">${value}</a>`;
                    var tabContent = `<div class="tab-pane" id="${value}" data-name="${value}" role="tabpanel"></div>`;
                    document.querySelector("#myList").insertAdjacentHTML("beforeend", tabList);
                    document.querySelector(".tab-content").insertAdjacentHTML("beforeend", tabContent);
                }
            });

            promise.then(function (arr) {
                TaskForm.jsonIsLoaded = true;

                for (let i = 0; i < arr.length; i++) {
                    var taskObjects = arr[i];

                    for (var key in taskObjects) {
                        var template = `<li class="list-group-item list-group-item-light"><a>${taskObjects[key].name}</a></li>`;
                        document.querySelectorAll(`.tab-content .tab-pane`).forEach(item => {
                            if (item.dataset.name === `${taskObjects[key].categoryName}`) {
                                item.insertAdjacentHTML("afterbegin", template);
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

        }
    };


    window.addEventListener("load", TaskForm.getTasks);

    listGroup.addEventListener('click', TaskForm.showTab);
    form.addEventListener("submit", TaskForm.createTask);


    var btnCreateList = document.querySelector("#btnCreateList");
    btnCreateList.addEventListener("click", TaskForm.createCategory);


})();

