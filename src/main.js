import FormController from "./controllers/form-controller";
import jQuery from "jquery";
import 'jquery-validation'

window.$ = window.jQuery = jQuery;


const form = document.querySelector('form');
const formController = new FormController(form);

formController.validate();
formController.submit();
