"use strict";

var form = document.forms.namedItem("task");
var showAll = document.querySelector(".show-all");

var TaskForm = {

    date: function () {
        var formData = {
            name: form.elements.namedItem("name").value,
            description: form.elements.namedItem("description").value,
        };

        return formData;
    },


    createTask: async function (event) {
        event.preventDefault();

        var date = TaskForm.date();

        await add(date, "/tasks.json");

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
        var dataTask = await get("/tasks.json");

        var promise = fbTransformToArray(dataTask);

        var taskList = document.querySelector(".task-list");

        promise.then(function (arr) {

            arr.forEach(function (item) {

                var task = document.createElement("li");
                task.innerText = item.name;
                taskList.insertAdjacentElement("afterbegin", task);
            })
        }).catch(e => console.log(e.message));

    },
};

form.addEventListener("submit", TaskForm.createTask);
showAll.addEventListener("click", TaskForm.getTasks);

