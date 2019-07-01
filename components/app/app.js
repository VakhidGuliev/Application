"use strict";

var form = document.forms.namedItem("task");

var TaskForm = {

    date: function (){
        var formData  = {
            name: form.elements.namedItem("name").value,
            description: form.elements.namedItem("description").value,
        };

        return formData;
    },


    createTask: async function (event) {
        event.preventDefault();

        var date = TaskForm.date();

        await add(date,"/tasks.json");
    }

};

form.addEventListener("submit",TaskForm.createTask);