import firebase from 'firebase/app';
import ModalService from "./modal-service";
import {fbTransformToArray} from "./transform-service";
import RenderService from "./render-service";


const userId = [];

class ApiService {
    constructor(){}

    getData(){

        const auth = firebase.auth();
        const database = firebase.database();

        auth.onAuthStateChanged(function (user) {
            if (user) {

                // User is signed in.

                let refTasks = database.ref(`Users/${user.uid}/Tasks`);
                let refUsers = database.ref(`Users/${user.uid}/userInfo`);
                refTasks.on("value", getCategories);
                refUsers.on("value",getUserInfo);
                refUsers.on("value",getUserId);


                function getCategories(data) {
                    const TaskObject = data.val();
                    const Tab = new ModalService().Tabs();
                    const promise = fbTransformToArray(TaskObject);

                    promise.then(function (arr) {
                        let objectKeys = Object.keys(TaskObject);

                        //Update database
                        document.querySelector("#myList").innerHTML = "";
                        document.querySelector(".tab-content").innerHTML = "";

                        objectKeys.forEach((value, index, array) => {
                            array = arr;

                            Tab.listContainer.insertAdjacentHTML("beforeend", Tab.renderLists(value, index, array[index].tasksCount));
                            Tab.tabContainer.insertAdjacentHTML("beforeend", Tab.renderTabs(value, index));

                            Tab.listContainer.querySelectorAll("a").forEach(value => value.classList.remove("active"));
                            Tab.tabContainer.querySelectorAll(".tab-pane").forEach(value => value.classList.remove("active"));

                            document.querySelector("#myList a:first-child").classList.add("active");
                            document.querySelector(".tab-content .tab-pane:first-child").classList.add("active");

                            document.querySelector(".categoriesName").innerHTML = array[0].categoryName;
                        });
                    })
                }
                function getTasks(data) {}
                function getUserInfo(data) {
                    let userInfo = data.val();

                    let accountForm = document.forms.namedItem("AccountSettings");
                    accountForm["user-name"].value = userInfo.username;
                    accountForm["user-email"].value = userInfo.email;
                    accountForm["user-phone"].value = userInfo.phone;
                    accountForm["user-password"].value = userInfo.password;
                }
                function getUserId(data) {
                    const userInfo = data.val();
                    userId.push(userInfo.id);
                }
            }
        });
    }

    createCategory(categoryName){

        const database = firebase.database();

        let ref = database.ref(`Users/${userId[0]}/Tasks`);
        ref.child(`${categoryName}`).set({
            categoryName: categoryName,
            id:0,
        }).then(response => response);

        new RenderService().renderCategory();
    }
    editCategory(){}
    deleteCategory(){}

    createTask(){}
    editTask(){}
    deleteTask(){}
}

export default ApiService;