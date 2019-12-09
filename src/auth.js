"use strict";


// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDqclOHPqTzVU3cmqryDJ7YGuCbYNRNGtk",
    authDomain: "application-c0501.firebaseapp.com",
    databaseURL: "https://application-c0501.firebaseio.com",
    projectId: "application-c0501",
    storageBucket: "application-c0501.appspot.com",
    messagingSenderId: "53230773832",
    appId: "1:53230773832:web:87f8de8c0d4bdfce"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


var formAuth = document.forms.namedItem("login-form");



var FormAuth = {
    email: formAuth.querySelector(".email"),
    password: formAuth.querySelector(".password"),
    message: formAuth.querySelector(".message"),


    validate: function () {
        var btnSignIn = formAuth.querySelector(".button[value=LogIn]");


        if (FormAuth.email.value === "" || this.password.value === "") {
            btnSignIn.disabled = "true";
            btnSignIn.classList.add("disabled")

        } else if (FormAuth.email.classList.contains("invalid")) {
            btnSignIn.disabled = "true";
            btnSignIn.classList.add("disabled")
        }


        if (!FormAuth.email.classList.contains("invalid")) {
            if (FormAuth.email.value !== "" && this.password.value !== "") {
                btnSignIn.removeAttribute("disabled");
                btnSignIn.classList.remove("disabled")
            }
        }


        // if (!isNaN(parseInt(FormAuth.email.value)) && FormAuth.email.value.length !== 0) {
        //     FormAuth.email.classList.add("invalid")
        // } else {
        //     FormAuth.email.classList.remove("invalid");
        // }
    },
    authentication: function (event) {
        event.preventDefault();
        var URL = "../app/app.html";

        const auth = firebase.auth();
        auth.signInWithEmailAndPassword(FormAuth.email.value, FormAuth.password.value).then(function () {
            window.open(URL, "_self");
            FormAuth.message.classList.add("successMessage");
            FormAuth.message.innerText = "Login in progress..."
        }).catch(function () {
            FormAuth.message.classList.add("errorMessage");
            FormAuth.message.innerText = "Invalid username or password!"
        });
    }
};


formAuth.addEventListener("keyup", FormAuth.validate);
formAuth.addEventListener("submit", FormAuth.authentication);


document.addEventListener("keyup", function (event) {
    if (event.keyCode === 8) {
        FormAuth.validate();
    }
});

