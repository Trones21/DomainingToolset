'use strict';
(function () {
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
                console.log("Valid");
                event.preventDefault();
                event.stopPropagation();
                let emailAddress = (<HTMLInputElement>document.getElementById('f_email')).value;
                let message = (<HTMLInputElement>document.getElementById('f_comments')).value;
                let body = {
                    Form: "Contact",
                    EmailAddress: emailAddress,
                    Message: message
                };
                let submitBtn = document.getElementById('submitBtn');
                (<HTMLSpanElement>submitBtn!.firstElementChild)!.setAttribute("style", "");
                (<HTMLSpanElement>submitBtn!.lastElementChild)!.innerText = "";
                setTimeout(() => sendMsg(body), 200);
                // sendMsg(body)

            }, false);
        });
    }, false);
})();

function sendMsg(body) {

    // 'https://c9whahb81l.execute-api.us-east-1.amazonaws.com/dev/contact'
    fetch('http://localhost:3000/contact',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        .then(res => {
            console.log("res");
            console.log(res.json())
            let submitArea = document.getElementById('submitArea');
            let successMsg = document.createElement('div');
            successMsg.innerText = "Sent!";
            submitArea!.appendChild(successMsg);
            setTimeout(() => {
                submitArea!.removeChild(successMsg);
            }, 4000)
            cleanupForm();
        })
}

function cleanupForm() {
    let submitBtn = document.getElementById('submitBtn');
    (<HTMLSpanElement>submitBtn!.firstElementChild)!.setAttribute("style", "display:none;");
    (<HTMLSpanElement>submitBtn!.lastElementChild)!.innerText = "Send!";
    let form = (<HTMLFormElement>document.getElementsByTagName("form")[0]);
    form.reset();
    form.classList.remove('was-validated');

    // (<HTMLFormElement>$('form')[0]).reset();
    // (<HTMLInputElement>document.getElementById('f_email')).value = "";
    // (<HTMLInputElement>document.getElementById('f_comments')).value = "";


}