"use strict";

window.loadJson = function (callback) {

    var URL = "data.json";

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    var isLoaded = false;

    function load() {
        var stop = false;

        if (xhr.status === 200 && isLoaded === false) {
            console.log(isLoaded);
            setTimeout(function () {
                isLoaded = true;
                return callback(xhr.response);
            }, 2000);

            setTimeout(function () {
                if (isLoaded === true) {
                    stop = true;
                }
            }, 4000)
        }


        setTimeout(function () {
            if (stop === true) {
                return false;
            }

        }, 5000)
    }


    xhr.addEventListener("load", load);

    xhr.open("GET", URL);
    xhr.send();
};








