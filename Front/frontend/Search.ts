import { openDB, deleteDB, wrap, unwrap } from 'idb';
import { xml2js } from 'xml-js';
import { Parser } from 'json2csv';
/*** My custom Bulk Search Tool ***/

//DynaDot Simple API (v2) & Advanced API (v3)
const basev2 = "https://api.dynadot.com/api2.html?key=";
const basev3 = "https://api.dynadot.com/api3.xml?key=";
const command = "&command=search";
const showprice = "&show_price=1";
var APIKey = "";

//Add event listeners
//@ts-ignore
$('#underConstructionModal').on('show.bs.modal', function (e) { })
$('#statusModal').on('show.bs.modal', function (e) { })
document.getElementById("ev_callAPI")!.addEventListener("click", main);
document.getElementById("invalidCheck")!.addEventListener("click", toggleErrorMsg);

var UCModal = $('#underConstructionModal');
//@ts-ignore
UCModal.modal({
    backdrop: 'static',
    keyboard: false
});
//@ts-ignore
UCModal.modal('show');


function toggleErrorMsg(e) {
    let lbl = e.target.nextElementSibling;
    console.log(lbl);
    if (e.target.checked == false) {
        lbl.classList.add('invalid');
    } else {
        lbl.classList.remove('invalid');
    }
}

async function main() {
    var PreRunCheck = document.getElementById("invalidCheck")!;
    //@ts-ignore
    if (PreRunCheck.checked == false) {
        let lbl = PreRunCheck.nextElementSibling!;
        lbl.classList.add('invalid');
        return;
    }
    var keyDiv = document.getElementById("apiKey")!;
    APIKey = keyDiv.getAttribute("value")!;

    var statusModal = $('#statusModal');
    //@ts-ignore
    statusModal.modal('show');

    //Check if API(s) are up 
    try {
        var V3apiStatus = "";
        await fetch(new Request(basev3 + APIKey + command + "&domain0=abc.com")).then(res => V3apiStatus = res.status.toString());

    }
    catch
    {
        updateStatusText("DynaDot API Server failed to respond")
    }

    var resultsTable = <HTMLTableElement>document.getElementById("res_tbody")!;

    //Create / Clear DB

    createDB();
    const db = await openDB("DomainsDB", 1);
    db.transaction('Domains', 'readwrite').objectStore('Domains').clear();

    //Clear Table
    var iterations = resultsTable.childElementCount
    for (let row = 0; row <= iterations; row++) {
        resultsTable.deleteRow(-1);
    }

    /* Radio button for Requests
        if("Redirect requests"){
            cloudflare logic
            --Note: We will have to repeat the parse and write to indexedDb logic because it is encapsulated within the fetch().then() sequence
            --Later: we could refactor so that we just send a different array of apiCallStrings -- i.e. cloudflareworkers.com instead of dynadot.com
        }else{
            local logic
        }
    */

    //Get Data + Write to iDB
    var calls: string[] = prepCalls();
    updateStatusText("Making API Calls")
    await MakeCallsSync(calls);

    await updateHTMLTable()

    //CSV
    var checkbox = document.getElementById("chk_csv")!;
    //@ts-ignore
    if (checkbox.checked == true) {
        updateStatusText("Creating CSV file")
        updateStatusBar(90);
        await CreateCSV();

    }

    updateStatusText("Finished!")
    updateStatusBar(100);

    //@ts-ignore
    statusModal.modal('hide');

    updateStatusText("")
    updateStatusBar(0);

}
function prepCalls(): string[] {
    updateStatusText("Preparing API calls")
    updateStatusBar(10);
    var Alldomains = (<HTMLInputElement>document.getElementById("ui_domains")!).value!.split('\n');
    var apiCalls: string[] = [];

    //Cleanup Domains 
    Alldomains = Alldomains.map(line => line.trim().toLowerCase());
    Alldomains = Alldomains.filter(d => d.length > 2);


    //Split into multiple calls & Create Strings -- Max 100 domains per call
    //Dev - Split into smaller segments
    var namesPerCall = 99

    var callsNeeded = Math.ceil((Alldomains.length / namesPerCall))
    for (let callIdx = 1; callIdx <= callsNeeded; callIdx++) {

        var startNum = (callIdx - 1) * namesPerCall
        var endNum = (callIdx) * namesPerCall
        var domainsList = Alldomains.slice(startNum, endNum);

        var domainParams = domainParamGen(domainsList)
        var apiCALLstring = basev3 + APIKey + command + domainParams + showprice;
        apiCalls.push(apiCALLstring);

    }

    return apiCalls;
}

function updateStatusText(text: string) {
    var statusText = document.getElementById("modalStatusBody")!;
    statusText.innerText = text;
}

function updateStatusBar(pct: number) {
    var statusBar = document.getElementById("modalStatusBar")!;
    statusBar.setAttribute("style", "width:" + pct + "%")

}

function domainParamGen(domains: Array<string>): string {
    var outputstr = "";
    domains.forEach((domain: string, index: Number) => {

        outputstr = outputstr + "&domain" + index + "=" + domain.trim();
    });
    return outputstr;
}

async function MakeCallsSync(calls: string[]) {

    for (var call of calls) {
        console.log(call);
        updateStatusText(`Making API Calls: ${calls.indexOf(call) + 1} of ${calls.length}`);
        await callAPI(call);
        updateStatusBar(10 + (calls.indexOf(call) + 1 / calls.length) * 60)


    }
}

async function callAPI(apiCALLstring: string) {

    console.log("Calling API: " + apiCALLstring);

    var reqInit = { method: 'GET' };
    var req = new Request(apiCALLstring, reqInit);
    await fetch(req)
        .then(response => response.text())
        .then(str => {
            var jsObj = xml2js(str, { compact: true });
            var resps = jsObj["Results"]["SearchResponse"]
            writeToDB(resps)
        });


}
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}


function createDB() {
    openDB("DomainsDB", 1, {
        upgrade(db) {
            // Create a store of objects
            const store = db.createObjectStore('Domains', {
                // The 'id' property of the object will be the key.
                keyPath: 'id',
                // If it isn't explicitly set, create a value by auto incrementing.
                autoIncrement: true,
            });
        }
    });
}

function test() {
    var checkbox = document.getElementById("chk_csv")!;

    //@ts-ignore
    if (checkbox.checked == true) {
        console.log("Checked")
    }

}

async function writeToDB(myArray: []) {
    const db = await openDB("DomainsDB", 1);
    const tx = db.transaction("Domains", "readwrite");

    if (myArray.length > 1) {
        for (var element of myArray) {
            await tx.store.add(element["SearchHeader"]);
        };
    } else {
        await tx.store.add(myArray["SearchHeader"]);
    }


}

async function updateHTMLTable() {

    updateStatusText("Creating HTML table");
    updateStatusBar(80);
    const db = await openDB("DomainsDB", 1);
    var domains = await db.getAll('Domains');
    var Table = <HTMLTableElement>document.getElementById("res_tbody");

    for await (let domain of domains) {
        var row = Table.insertRow(-1);
        var num = row.insertCell(0);
        var Name = row.insertCell(1);
        var isAvailable = row.insertCell(2);
        var Price = row.insertCell(3);
        var compare = row.insertCell(4);

        num.innerText = String(domains.indexOf(domain) + 1);
        Name.innerText = domain.DomainName._text;

        if (domain.SuccessCode._text === "0") {
            isAvailable.innerText = domain.Available._text;

            if (domain.Price === undefined) {
                Price.innerText = ""
            } else {
                Price.innerText = domain.Price._text;

                var link = document.createElement("a");
                link.setAttribute("href", "https://www.domcomp.com/?refcode=5dcc3367100000545fadd104");
                link.setAttribute("target", "_blank");
                var btn = document.createElement("button");
                btn.className = "btn btn-outline-primary";
                btn.innerText = "DomComp";
                link.appendChild(btn);
                compare.appendChild(link);
            }
        } else {
            isAvailable.innerText = "Error";
        }
    }
}

async function CreateCSV() {

    const db = await openDB("DomainsDB", 1);
    var domains = await db.getAll('Domains');

    const fields = ['DomainName._text', 'Available._text', 'Price._text'];
    const opts = { fields };

    console.log(domains);
    try {
        const parser = new Parser(opts);
        const csv = parser.parse(domains);
        var encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "domain_Name_Info.csv");
        document.body.appendChild(link); // Required for FF
        link.click();

    } catch (err) {
        console.error(err);
    }



}






