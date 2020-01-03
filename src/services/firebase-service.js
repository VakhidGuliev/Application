import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


const userId = [];

class FirebaseService {

    constructor() {}

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

            const auth = firebase.auth();
            auth.onAuthStateChanged(function (user) {
                if (user) {
                    // User is signed in.
                    userId.push(user.uid);
                    console.log(userId);
                } else {
                    // User is signed out.
                    window.open("../auth/auth.html", "_self");
                }
            });
            return userId;
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
            }).then(() => window.open("../public/auth.html", "_self"))
        }).catch((e)=> console.log(e.message));
    }
    login(form){

        const auth = firebase.auth();

        auth.signInWithEmailAndPassword(form.email.value, form.password.value).then(function () {
            window.open("../public/app.html", "_self");
        }).catch(function () {
        });
    }
}

new FirebaseService().init();

export  default FirebaseService;