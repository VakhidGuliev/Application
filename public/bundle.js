/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/controllers/form-controller.js":
/*!********************************************!*\
  !*** ./src/controllers/form-controller.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _services_validate_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/validate-service */ "./src/services/validate-service.js");




class FormController {

    constructor(form) {
        this.form = form;
    }

    submit() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();

            this.validate();
        })
    }

    validate() {

        this.form.addEventListener(`change`, ()=> {

            const validateService = new _services_validate_service__WEBPACK_IMPORTED_MODULE_0__["default"]();

            if (this.form.name === "registration") {
                validateService.registration();
            }
            if (this.form.name === "authForm") {
                validateService.auth();
            }
        });
    }
}

/* harmony default export */ __webpack_exports__["default"] = (FormController);

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _controllers_form_controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controllers/form-controller */ "./src/controllers/form-controller.js");



const form = document.querySelector('form');
const formController = new _controllers_form_controller__WEBPACK_IMPORTED_MODULE_0__["default"](form);

formController.validate();
formController.submit();

/***/ }),

/***/ "./src/services/validate-service.js":
/*!******************************************!*\
  !*** ./src/services/validate-service.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class ValidateService {
    constructor(){}

    registration(){

        const form = document.forms.namedItem('registration');
        const btnSend = form.querySelector("button[type=submit]");


        $(form).validate({
            rules: {
                firstName: {
                    required: true,
                    rangelength :[2,10]
                },
                lastName: {
                    required: true,
                    rangelength :[2,15]
                },
                date:{
                    required:true,
                    date: true
                },
                email:{
                    required :true,
                    email: true
                },
                password : {
                    required:true,
                    rangelength:[6,50]
                },
                confirmPassword: {
                    required:true,
                    equalTo : "#password"

                }
            },
            messages: {
                firstName: {
                    required:"Please enter your first name",
                    rangelength: "Login format not valid",
                },
                lastName: {
                    required:"Please enter your last name",
                    rangelength: "Login format not valid",
                },
                email : {
                    required:"Please input your email"
                },
                password:{
                    required:"Please enter your password",
                },
                confirmPassword: {
                    required:"Please enter confirmPassword",
                    equalTo: "Password and Confirm password  dont match"
                }
            },
            submitHandler: function (form) {
                form.submit();
                return false;
            }
        });

        if ($(form).valid()) {
            $(btnSend).removeClass('disabled');
            $(btnSend).removeAttr('disabled');
        }
    };


    auth(){
        const form = document.forms.namedItem('authForm');

        $(form).validate({
            rules: {

                email:{
                    required :true,
                    email: true
                },
                password : {
                    required:true,
                }

            },
            messages: {

                email : {
                    required:"Please input your email"
                },
                password:{
                    required:"Please enter your password",
                }

            },
            submitHandler: function (form) {
                form.submit();
                return false;
            }
        });
    };
}

/* harmony default export */ __webpack_exports__["default"] = (ValidateService);

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map