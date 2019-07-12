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
                id: Math.round(Math.random() * (100 - 1) + 1),
                Date: new Date().toLocaleDateString(),
                Time: new Date().toLocaleTimeString()
            };

            return formData;
        },
        getCategoryName: function () {
            var tabName = document.querySelectorAll(".tab-content .tab-pane");
            var categoriesName;

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
        getTasks: async function () {
            let dataTask = await get("/Tasks.json");
            let promise = fbTransformToArray(dataTask);

            promise.then(function (arr) {
                TaskForm.jsonIsLoaded = true;

                for (let i = 0; i < arr.length; i++) {
                    var taskObjects = arr[i];

                    for (var key in taskObjects) {

                        var template = `<li class="list-group-item list-group-item-primary"><a>${taskObjects[key].name}</a></li>`;
                        document.querySelectorAll(`.tab-content .tab-pane`).forEach(item => {
                            if (item.dataset.name === `${taskObjects[key].categoryName}`){
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

})();

