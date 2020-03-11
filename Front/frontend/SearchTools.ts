import './Search.css';

// const css = require('./Search.css').toString();
// console.log(css)

let submitBtn = document.getElementById('submitBtn');
submitBtn!.addEventListener('click', send)

function send() {
    let text = (<HTMLInputElement>document.getElementById('textinput')).value;
    if (text.length < 1) { return; }
    let body = {
        Form: "Bulk Search",
        Message: text
    };

    (<HTMLSpanElement>submitBtn!.firstElementChild)!.setAttribute("style", "");
    (<HTMLSpanElement>submitBtn!.lastElementChild)!.innerText = "";
    setTimeout(() => { }, 200);

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
    (<HTMLInputElement>document.getElementById('textinput')).value = "";
}




