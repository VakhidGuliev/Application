// transform firebase data to object=>
async function fbTransformToArray(fbData) {
    return Object.keys(fbData).map(function (value) {
        const item = fbData[value];

        item.tasksCount = Object.keys(item).length-2;
        return item;
    })
}
export {fbTransformToArray};