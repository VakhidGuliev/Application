"use strict";

var form = document.forms.namedItem("login-form");


var Form = {
    name: form.querySelector(".username"),
    password: form.querySelector(".password"),

    isLoad: false,
    formDat: "",

    validate: function () {
        var btnSignIn = form.querySelector(".button[value=ВОЙТИ]");


        if (Form.name.value === "" || this.password.value === "") {
            btnSignIn.disabled = "true";
            btnSignIn.classList.add("disabled")

        } else if (Form.name.classList.contains("invalid")) {
            btnSignIn.disabled = "true";
            btnSignIn.classList.add("disabled")
        }


        if (!Form.name.classList.contains("invalid")) {
            if (Form.name.value !== "" && this.password.value !== "") {
                btnSignIn.removeAttribute("disabled");
                btnSignIn.classList.remove("disabled")
            }
        }


        if (!isNaN(parseInt(Form.name.value)) && Form.name.value.length !== 0) {
            Form.name.classList.add("invalid")
        } else {
            Form.name.classList.remove("invalid");
        }


    },
    authentication: function (event) {
        event.preventDefault();

        if (Form.isLoad){
            return;
        }

        window.loadJson(function (data) {
            Form.isLoad = true;
            var openURL = "http://localhost:63342/Application/App.html";
            var arr = [];

            console.log(data);
            console.log(arr);


            Form.formDat = arr;


            for (var key in data) {
                for (let i = 0; i < data[key].length; i++) {
                    arr[i] = data[key][i];
                }

                Form.validationBackend(arr, openURL);
            }
        });
    },
    validationBackend: function (arr, url) {

        var message = document.querySelector(".header > span");

        var isContainsName = false;
        for (let i = 0; i < arr.length; i++) {
            if (Form.name.value === arr[i].name && this.password.value === arr[i].password.toString()) {
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


form.addEventListener("keyup", Form.validate);

form.addEventListener("submit", Form.authentication);


document.addEventListener("keyup", function (event) {
    if (event.keyCode === 8) {
        Form.validate();
    }
});

