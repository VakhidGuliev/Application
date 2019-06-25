"use strict";

window.loadJson = function (callback) {

    var URL = "data.json";

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";


    function load() {
        if (xhr.status === 200) {

            return callback(xhr.response);
        }

    }

    xhr.addEventListener("load", load);

    xhr.open("GET", URL);
    xhr.send();
};








