import FormController from "./controllers/form-controller";


const form = document.querySelector('form');
const formController = new FormController(form);

formController.validate();
formController.submit();