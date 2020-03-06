
document.getElementById("Run")!.addEventListener("click", Run);
document.getElementById("AddPart")!.addEventListener("click", AddPart);
document.getElementById("RemovePart")!.addEventListener("click", RemovePart);

var clipboard = new ClipboardJS('.btn')
clipboard.on("success", function (e) {
    console.log("Copied Results to clipboard")
})
clipboard.on("error", function (e) {
    console.log("Error copying to clipboard")
})

function Run() {

    var PermResTable = <HTMLTableElement>document.getElementById("PermResTable");

    //Clear Table
    var iterations = PermResTable.childElementCount
    for (let row = 0; row <= iterations; row++) {
        PermResTable.deleteRow(-1);
    }

    //Get input and Cleanup
    var inputArrays: Array<Array<string>> = [];

    var partsArr = [...Array.from(document.getElementById("parts")!.children)]
    for (var part of partsArr) {
        var singleArr =
            (<HTMLInputElement>part.firstElementChild!).value!.split('\n')
                .map(line => line.trim().toLowerCase())
                .filter(line => line.length > 0);

        inputArrays.push(singleArr)
    }

    var Ext: string[] = (<HTMLInputElement>document.getElementById("ext")!.firstElementChild).value!.split('\n')
        .map(line => line.trim().toLowerCase())
        .filter(line => line.length > 0);
    inputArrays.push(Ext)

    //Need to remove empty arrays
    var arraysToCombine = inputArrays.filter(a => a.length > 0);

    var getAllCombinations = function (arraysToCombine) {
        var divisors: number[] = [];
        for (var i = arraysToCombine.length - 1; i >= 0; i--) {
            divisors[i] = divisors[i + 1] ? divisors[i + 1] * arraysToCombine[i + 1].length : 1;
        }

        function getPermutation(n, arraysToCombine) {
            var result: Array<string> = [],
                curArray;
            for (var i = 0; i < arraysToCombine.length; i++) {
                curArray = arraysToCombine[i];
                result.push(curArray[Math.floor(n / divisors[i]) % curArray.length]);
            }
            return result;
        }

        var numPerms = arraysToCombine[0].length;
        for (var i = 1; i < arraysToCombine.length; i++) {
            numPerms *= arraysToCombine[i].length;
        }

        var combinations: any = [];
        for (var i = 0; i < numPerms; i++) {
            combinations.push(getPermutation(i, arraysToCombine));
        }
        return combinations;
    }

    //Transform into right type
    var twoDarray: Array<Array<string>> = getAllCombinations(arraysToCombine)
    var domainNames: Array<string> = [];
    for (var arr of twoDarray) {
        var domainName = arr.join("");
        domainNames.push(domainName);
    }

    //Show Table
    var resultsDiv = <HTMLDivElement>document.querySelector(".resultsDiv")!;
    resultsDiv.style.display = 'inline';
    for (let domainName of domainNames) {
        var row = PermResTable.insertRow(-1);
        var Name = row.insertCell(0);
        Name.innerText = domainName;
    }
}

function AddPart() {

    var parent = document.getElementById("parts")!;
    var partNum = parent.childElementCount + 1;
    var outerDiv = document.createElement("div");
    outerDiv.className = "col-sm";
    outerDiv.id = partNum.toString();
    outerDiv.innerText = "Part " + partNum.toString();
    var textArea = document.createElement("textarea");
    textArea.className = "form-control";
    textArea.setAttribute("rows", "3");
    outerDiv.appendChild(textArea);
    parent.appendChild(outerDiv);
}

function RemovePart() {
    var parent = document.getElementById("parts")!;
    var partID = parent.childElementCount;
    var last = <HTMLElement>parent.lastElementChild
    var remove = <Node>last.previousElementSibling
    parent.removeChild(last)
}


