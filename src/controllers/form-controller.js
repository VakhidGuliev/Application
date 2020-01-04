import ValidateService from "../services/validate-service";
import FirebaseService from "../services/firebase-service";


class FormController {

    constructor(form) {
        this.form = form;
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