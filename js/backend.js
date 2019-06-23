"use strict";

window.loadJson = function (callback) {
    var URL = "data.json";

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    xhr.addEventListener("load", function () {
        if (xhr.status === 200) {
            return callback(xhr.response);
        }
        throw new Error("Ошибка сервера: " + " Статус ответа " + xhr.status + " " + xhr.statusText)
    });


    xhr.open("GET", URL);
    xhr.send();
};








