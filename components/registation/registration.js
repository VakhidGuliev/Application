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

var database = firebase.database();


var formRegistration = document.forms.namedItem("registration");

var FormRegistration = {

    date: function () {
        var formData = {
            firstName: formRegistration.querySelector("#first_name").value,
            lastName: formRegistration.querySelector("#last_name").value,
            birthDay: formRegistration.querySelector("#birthday").value,
            email: formRegistration.querySelector("#email").value,
            phoneNumber: formRegistration.querySelector("#phone").value,
            password: formRegistration.querySelector("#password").value,
            confirmPassword: formRegistration.querySelector("#confirmPassword").value,
        };

        return formData;
    },
    validate: function (event) {

        event.preventDefault();

        var btnSend = formRegistration.querySelector("button[type=submit]");
        var date = FormRegistration.date();

        if (!date.firstName || !date.lastName || !date.birthDay || !date.email ||
            !date.phoneNumber || !date.password || !date.confirmPassword) {

            btnSend.disabled = "true";
            btnSend.classList.add("disabled");

        } else if (date.password !== date.confirmPassword) {

            btnSend.disabled = "true";
            btnSend.classList.add("disabled");

        } else {
            btnSend.removeAttribute("disabled");
            btnSend.classList.remove("disabled");
        }


    },
    addUser: async function (event) {
        var date = FormRegistration.date();

        var user = firebase.auth();

        var URL = "../auth/auth.html";

        event.preventDefault();

        user.createUserWithEmailAndPassword(date.email, date.password)
            .then(function (cred) {
                const userId = cred.user.uid;
                return database.ref(`Users/${userId}/userInfo`).set({
                    username: date.firstName,
                    birthday: date.birthDay,
                    email: date.email,
                    password: date.password,
                    phone: date.phoneNumber,
                    id: userId
                }).then(() => {
                    window.open(URL, "_self");
                }).catch((e)=> console.log(e.message));
            }).catch((e)=> console.log(e.message));
    }
};


formRegistration.addEventListener("change", FormRegistration.validate);
formRegistration.addEventListener("submit", FormRegistration.validate);
formRegistration.addEventListener("submit", FormRegistration.addUser);
