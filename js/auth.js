"use strict";

var form = document.forms.namedItem("login-form");

form.addEventListener("submit", authentication);


function authentication(event) {

    event.preventDefault();

    var formData = {
        name: form.elements.namedItem("username").value,
        password: form.elements.namedItem("password").value
    };


    window.loadJson(function (data) {
        var openURL = "http://localhost:63342/Application/App.html";
        var arr = [];

        for (var key in data) {
            for (let i = 0; i < data[key].length; i++) {
                arr[i] = data[key][i];
            }

            validation(formData, arr, openURL)
        }
    });
}


function validation(formData, arr, url) {
    var isContainsName = false;
    for (let i = 0; i < arr.length; i++) {
        if (formData.name === arr[i].name && formData.password === arr[i].password.toString()) {
            window.open(url, "_self");
            isContainsName = true;
            break;
        }

    }
    if (!isContainsName) {
        var message = document.querySelector(".header > span");
        message.textContent = "Неверный логин или пароль!";
        message.classList.add("errorMessage");
    }

    return isContainsName;
}



