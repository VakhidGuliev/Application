import ValidateService from "../services/validate-service";
import FirebaseService from "../services/firebase-service";
import firebase from 'firebase/app';


class FormController {

    constructor(form) {
        this.form = form;

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

    submit() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();

            this.validate();
            const fireBaseService = new FirebaseService();

            if (this.form.name === "registration") {
                fireBaseService.registration(this.form);
            }
            if (this.form.name === "authForm") {
                fireBaseService.login(this.form);
            }
        })
    }

    validate() {

        this.form.addEventListener(`change`, ()=> {

            const validateService = new ValidateService();

            if (this.form.name === "registration") {
                validateService.registration();
            }
            if (this.form.name === "authForm") {
                validateService.auth();
            }
        });
    }
}

export default FormController;