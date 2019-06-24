"use strict";

var form = document.forms.namedItem("login-form");


var Form = {
    name: form.querySelector(".username"),
    password: form.querySelector(".password"),

    activate: function () {
        var btnSignIn = form.querySelector(".button[value=ВОЙТИ]");

        if (this.name.value === "" || this.password.value === "") {
            btnSignIn.disabled = "true";
            btnSignIn.classList.add("disabled");

        }
        if (this.name.value !== "" && this.password.value !== "") {
            btnSignIn.removeAttribute("disabled");
            btnSignIn.classList.remove("disabled");
        }

    },
    validate: function () {
        if (!isNaN(parseInt(Form.name.value))){
            Form.name.style.border = "1px solid red";
        } else {
            Form.name.style.border = "none";
        }
    }
    ,
    authentication: function (event) {
        event.preventDefault();

        window.loadJson(function (data) {
            var openURL = "http://localhost:63342/Application/App.html";
            var arr = [];

            for (var key in data) {
                for (let i = 0; i < data[key].length; i++) {
                    arr[i] = data[key][i];
                }

                Form.validationBackend(arr, openURL)
            }
        });
    },
    validationBackend: function (arr, url) {

        var message = document.querySelector(".header > span");

        var isContainsName = false;
        for (let i = 0; i < arr.length; i++) {
            if (this.name.value === arr[i].name && this.password.value === arr[i].password.toString()) {
                setTimeout(function () {
                    window.open(url, "_self")
                }, 3000);
                isContainsName = true;

                message.textContent = "Выполняется вход...";
                message.classList.add("successMessage");
                break;
            }

        }
        if (!isContainsName) {
            message.textContent = "Неверный логин или пароль!";
            message.classList.add("errorMessage");
        }

        return isContainsName;
    }
};

Form.activate();

form.addEventListener("keyup",Form.validate);
form.addEventListener("keyup", Form.activate);
form.addEventListener("submit", Form.authentication);


document.addEventListener("keyup", function (event) {
    if (event.keyCode === 8) {
        Form.activate();
    }
});