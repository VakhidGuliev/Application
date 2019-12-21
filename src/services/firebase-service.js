import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';



class FirebaseService {

    constructor() {}

    registration(form) {
        const database = firebase.database();
        const auth = firebase.auth();

        auth.createUserWithEmailAndPassword(form.email.value, form.password.value).then(function (cred) {

            const userId = cred.user.uid;

            return database.ref(`Users/${userId}/userInfo`).set({
                username: form.firstName.value,
                birthday: form.birthday.value,
                email: form.email.value,
                password: form.password.value,
                phone: form.phone.value,
                id: userId
            }).then(() => window.open("../public/auth.html", "_self"))
        }).catch((e)=> console.log(e.message));
    }

    login(form){

        const auth = firebase.auth();

        auth.signInWithEmailAndPassword(form.email.value, form.password.value).then(function () {
            window.open("../public/app.html", "_self");
            form.message.classList.add("successMessage");
            form.message.innerText = "Login in progress..."
        }).catch(function () {
            form.message.classList.add("errorMessage");
            form.message.innerText = "Invalid username or password!"
        });
    }

    createCategory(){}

}

export  default FirebaseService;