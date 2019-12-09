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

export default ValidateService;