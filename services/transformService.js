"use strict";

async function fbTransformToArray(fbData) {
    return Object.keys(fbData).map(function (value) {
        const item = fbData[value];

        item.keys = Object.keys(item).slice(1,item.length);
        item.tasksCount = Object.keys(item).length - 2;
        item.id = value;
        return item;
    })
}