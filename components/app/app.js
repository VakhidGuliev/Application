"use strict";

var form = document.forms.namedItem("task");
var tabNav = document.querySelectorAll("#myList a");


var TaskForm = {

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
            document.querySelector(".container").insertAdjacentElement("afterbegin", alert);
        }, 500);
        setTimeout(function () {
            document.querySelector(".alert.alert-success").remove();
        }, 2000)

    },

    getTasks: async function () {
        let date = TaskForm.date();

        let dataTask = await get(`/Tasks/${date.categoryName}.json`);
        let promise = fbTransformToArray(dataTask);

        var tabContent = document.querySelector(".tab-content .tab-pane.active");

        promise.then(function (arr) {
            tabContent.innerHTML = "";

            arr.forEach(function (item) {
                var listGroup = document.createElement("div");
                listGroup.innerHTML = `<a style="margin-top:10px;" class="list-group-item list-group-item-action list-group-item-primary" href="#">${item.name}</a>`;
                tabContent.insertAdjacentElement("afterbegin", listGroup);
                document.querySelector(".categoriesName").innerHTML = `${item.categoryName}`
            })
        }).catch(e => {
            setTimeout(function () {
                tabContent.innerHTML = `<a style="margin-top:10px;" class="list-group-item list-group-item-action list-group-item-danger" href="#">Нет созданных записей!</a>`;
            }, 100);
            setTimeout(function () {
                document.querySelector(".list-group-item-danger").remove();
            }, 2000)
        });
    },
};

form.addEventListener("submit", TaskForm.createTask);

tabNav.forEach(nav => {
    nav.addEventListener("mousedown", function () {
        if (nav.classList.contains("active")) {
            TaskForm.getTasks();
        }
    })
});
