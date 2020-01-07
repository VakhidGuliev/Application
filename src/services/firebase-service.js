import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


class FirebaseService {

    constructor() {
        this.init();
    }

    init(){
        const firebaseConfig = {
            apiKey: "AIzaSyAtV83XESmZQD4-YhatEp7MOFghOt6cnHE",
            authDomain: "jstest-f8715.firebaseapp.com",
            databaseURL: "https://jstest-f8715.firebaseio.com",
            projectId: "jstest-f8715",
            storageBucket: "jstest-f8715.appspot.com",
            messagingSenderId: "1006017018685",
            appId: "1:1006017018685:web:50e5961a85742c6db42354"
        };
        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig)
        }
    }

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
            }).then(() => window.open("../auth.html", "_self"))
        }).catch((e)=> console.log(e.message));
    }
    login(form){

        const auth = firebase.auth();

        auth.signInWithEmailAndPassword(form.email.value, form.password.value).then(function () {
            window.open("../app.html", "_self");
        }).catch(function () {
        });
    }
}

export  default FirebaseService;
