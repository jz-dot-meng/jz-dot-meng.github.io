const option = ["choose...", "Polkadot", "Stellar", "Algorand"];

let currency = 'aud';
function changeAUD() {
    currency = 'aud';
    alert("currency: " + currency);
}
function changeUSD() {
    currency = 'usd';
    alert("currency: " + currency);
}

let piechartData = [];
const ctx = document.getElementById("piechart").getContext("2d");
const dataChart = new Chart(ctx, {
    type: "doughnut",
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [],
        }]

    },
})

let rowcount = 0;

const table = document.getElementById("assetTable");

function addAddress() {
    let temprow = rowcount;
    table.style.visibility = "visible";
    let newRow = document.createElement("tr");
    newRow.setAttribute("id", rowcount);
    table.appendChild(newRow);

    // add selector cell
    let selectorCell = document.createElement("td");
    newRow.append(selectorCell);
    // add select object
    let selector = document.createElement("select");
    selector.setAttribute("id", "selector" + rowcount);
    for (let i = 0; i < option.length; i++) {
        let choice = document.createElement("option");
        choice.setAttribute("value", i);
        choice.innerText = option[i];
        selector.appendChild(choice);
    }
    selectorCell.appendChild(selector);
    selector.addEventListener('change', function () {
        generateForm(selector.value, temprow);
    })
    rowcount++;
}

function generateForm(item, rowcount) {
    let row = document.getElementById(rowcount);
    let testelement = document.getElementById("address" + rowcount);
    if (testelement == null) {
        create(rowcount, row);
    } else {
        let address = document.getElementById("address" + rowcount);
        let loader1 = document.getElementById("loaderOne" + rowcount);
        let loader2 = document.getElementById("loaderTwo" + rowcount);
        let value = document.getElementById("value" + rowcount);
        let amount = document.getElementById("amount" + rowcount);
        // not the best solution, but we're clearing all the piechartData, will need to automate calling api for every filled address field
        piechartData = [];
        redrawPie();
        // clear html elements
        value.innerHTML = "";
        amount.innerHTML = "";
        address.value = "";
        // remove event listener
        address.removeEventListener('focusout', dotcreator(address, loader1, loader2, value, amount) || xlmcreator(address, loader1, loader2, value, amount) || algocreator(address, loader1, loader2, value, amount));
    }
    const address = document.getElementById("address" + rowcount);
    const loader1 = document.getElementById("loaderOne" + rowcount);
    const loader2 = document.getElementById("loaderTwo" + rowcount);
    const value = document.getElementById("value" + rowcount);
    const amount = document.getElementById("amount" + rowcount);
    switch (item) {
        case "0":
            break;
        case "1":
            address.addEventListener('focusout', dotcreator(address, loader1, loader2, value, amount));
            break;
        case "2":
            address.addEventListener('focusout', xlmcreator(address, loader1, loader2, value, amount));
            break;
        case "3":
            address.addEventListener('focusout', algocreator(address, loader1, loader2, value, amount));
            break;
    }

}

function create(rowcount, row) {
    // add address cell
    let addressCell = document.createElement("td");
    row.appendChild(addressCell);
    // add address input
    let address = document.createElement("input");
    address.setAttribute("id", "address" + rowcount);
    address.setAttribute("type", "text");
    addressCell.appendChild(address);
    // add amount cell
    let amountCell = document.createElement("td");
    row.appendChild(amountCell);
    // add amount div
    let amount = document.createElement("div");
    amount.setAttribute("id", "amount" + rowcount);
    amountCell.appendChild(amount);
    // add loader
    let loader1 = document.createElement('div');
    loader1.setAttribute("id", "loaderOne" + rowcount);
    loader1.setAttribute("class", 'loader');
    loader1.style.display = "none";
    amountCell.appendChild(loader1);
    // add value cell
    let valueCell = document.createElement("td");
    row.appendChild(valueCell);
    // add value div
    let value = document.createElement("div");
    value.setAttribute("id", "value" + rowcount);
    valueCell.appendChild(value);
    // add loader2
    let loader2 = document.createElement('div');
    loader2.setAttribute('id', "loaderTwo" + rowcount);
    loader2.setAttribute("class", 'loader');
    loader2.style.display = "none";
    valueCell.appendChild(loader2);
}

function algocreator(address, loader1, loader2, value, amount) {
    return async function () {
        // add event listener
        loader1.style.display = "block";
        loader2.style.display = "block";
        let response = await fetch("https://rocky-beyond-27768.herokuapp.com/testalgorand/address/" + address.value)
        if (response.ok) {
            let json = await response.json();
            if (!Object.keys(json).length) {
                // ie if json is empty, indicating an error
                address.value = "";
            } else {
                let numtokens = Number(json["Balance"]);
                loader1.style.display = 'none';
                amount.innerText = numtokens + " ALGO";

                let gecko = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=algorand&vs_currencies=" + currency);
                if (gecko.ok) {
                    let jsonB = await gecko.json();
                    loader2.style.display = "none";
                    value.innerText = currency.toUpperCase() + "$" + Number(jsonB["algorand"][currency]) * numtokens;
                    piechartData.push({ "coin": "ALGO", "value": (Number(jsonB["algorand"][currency]) * numtokens) });
                    redrawPie();
                }
            }
        }
    }
}

function xlmcreator(address, loader1, loader2, value, amount) {
    return async function () {
        loader1.style.display = "block";
        loader2.style.display = "block";
        let response = await fetch("https://rocky-beyond-27768.herokuapp.com/teststellar/address/" + address.value);
        if (response.ok) {
            let json = await response.json();
            if (!Object.keys(json).length) {
                address.value = "";
            } else {
                let tokenArr = json["Balances"];
                loader1.style.display = 'none';
                for (let i = 0; i < tokenArr.length; i++) {
                    let tokenDiv = document.createElement("div");
                    tokenDiv.setAttribute("id", "xlmToken" + i);
                    amount.appendChild(tokenDiv);
                    tokenDiv.innerText = tokenArr[i]["Balance"] + " " + tokenArr[i]["Asset_code"];
                }

                let gecko = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=" + currency);
                if (gecko.ok) {
                    let jsonB = await gecko.json();
                    loader2.style.display = "none";
                    for (let i = 0; i < tokenArr.length; i++) {
                        let tokenValDiv = document.createElement('div');
                        tokenValDiv.setAttribute("id", 'xlmValToken' + i);
                        value.appendChild(tokenValDiv);
                        // if not xlm, retrieve xlm conversion
                        if (tokenArr[i]["Asset_code"] == "XLM") {
                            tokenValDiv.innerText = currency.toUpperCase() + "$" + (Number(jsonB["stellar"][currency]) * Number(tokenArr[i]["Balance"]));
                            piechartData.push({ "coin": tokenArr[i]["Asset_code"], "value": (Number(jsonB["stellar"][currency]) * Number(tokenArr[i]["Balance"])) });
                            redrawPie();
                        } else if (tokenArr[i]["Asset_code"] != "XLM" && tokenArr[i]["Latest_bid_to_xlm"] != "not_available") {
                            tokenValDiv.innerText = currency.toUpperCase() + "$" + (Number(jsonB["stellar"][currency]) * Number(tokenArr[i]["Balance"]) * Number(tokenArr[i]["Latest_bid_to_xlm"]))
                            piechartData.push({ "coin": tokenArr[i]["Asset_code"], "value": (Number(jsonB["stellar"][currency]) * Number(tokenArr[i]["Balance"]) * Number(tokenArr[i]["Latest_bid_to_xlm"])) });
                            redrawPie();
                        } else {
                            tokenValDiv.innerText = "Token conversion to XLM not found, unable to provide fiat value";
                        }
                    }
                }
            }
        }
    }
}


function dotcreator(address, loader1, loader2, value, amount) {
    return async function () {
        loader1.style.display = "block";
        loader2.style.display = "block";
        let response = await fetch("https://rocky-beyond-27768.herokuapp.com/testpolkadot/address/" + address.value)
        if (response.ok) {
            let json = await response.json();
            if (!Object.keys(json).length) {
                // ie if json is empty, indicating an error
                address.value = "";
            } else {
                let numtokens = Number(json["Balance"]) / Math.pow(10, 10);
                loader1.style.display = 'none';
                amount.innerText = numtokens + " DOT";

                let gecko = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=" + currency);
                if (gecko.ok) {
                    let jsonB = await gecko.json();
                    loader2.style.display = "none";
                    value.innerText = currency.toUpperCase() + "$" + Number(jsonB["polkadot"][currency]) * numtokens;
                    piechartData.push({ "coin": "DOT", "value": (Number(jsonB["polkadot"][currency]) * numtokens) });
                    redrawPie();
                }
            }
        }
    }
}

function redrawPie() {
    dataChart.data.labels = [];
    dataChart.data.datasets[0]['data'] = [];
    for (let i = 0; i < piechartData.length; i++) {
        dataChart.data.labels.push(piechartData[i]["coin"]);
        dataChart.data.datasets[0]['data'].push(piechartData[i]["value"]);
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
        dataChart.data.datasets[0]["backgroundColor"].push('rgba(' + r + ',' + g + ',' + b + ',0.85)');
    }
    dataChart.update();
}
