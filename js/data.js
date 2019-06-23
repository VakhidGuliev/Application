"use strict";

var form = document.forms.namedItem('blog');
var formSearch = document.forms.namedItem("find");

var key = Math.round(Math.random() * (100 - 1) + 1);

form.addEventListener("submit", sendData);
// formSearch.addEventListener("submit", search);


function sendData(evt) {
    evt.preventDefault();
    var data = {
        title: form.elements.namedItem("title").value,
        description: form.elements.namedItem("description").value,
        id: key,
    };


    var serialObj = JSON.stringify(data); //сериализуем его

    localStorage.setItem(key, serialObj); //запишем его в хранилище по ключу "Key"

    form.reset();

    window.location.reload();
}


// var Name = document.querySelector(".name");
// var Job = document.querySelector(".job");
//
//
// function search(evt) {
//     evt.preventDefault();
//     var clientId = formSearch.elements.namedItem("id").value;
//     var user = JSON.parse(localStorage.getItem(clientId)); //спарсим его обратно объект
//
//     Name.textContent = user.name;
//     Job.textContent = user.job;
// }
