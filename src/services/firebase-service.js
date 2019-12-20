import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


class FirebaseService {
    constructor(){
        this.auth = firebase.auth();
        this.database = firebase.database();

    }


    registration(form){
        this.auth.createUserWithEmailAndPassword(form.email.value, form.password.value).then(function (r) {
            window.open("../public/auth.html", "_self");
        }).catch((e)=> e.message);
    }

    login(form){
        this.auth.signInWithEmailAndPassword(form.email.value, form.password.value).then(function () {
            window.open("../public/app.html", "_self");
        }).catch((e)=> e.message);
    }
}

export  default FirebaseService;