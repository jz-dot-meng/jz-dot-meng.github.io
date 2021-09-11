const option = ["choose...", "Polkadot"];


let currency = 'aud';
function changeAUD() {
    currency = 'aud';
    // eventually change to css visual cues
    alert("currency: " + currency);
}
function changeUSD() {
    currency = 'usd';
    alert("currency: " + currency);
}

let rowcount = 0;

const table = document.getElementById("assetTable")

function addAddress() {
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
        generateForm(selector.value, rowcount);
    })
}

function generateForm(item, rowcount) {
    switch (item) {
        case "0":
            break;
        case "1":
            // fill rest of row out
            dotcreator(rowcount)
    }
}

function dotcreator(rowcount) {
    let row = document.getElementById(rowcount);
    let testelement = document.getElementById("address" + rowcount);
    // if item doesnt already exist:
    if (testelement == null) {
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
        loader2.setAttribute("class", 'loader');
        loader2.style.display = "none";
        valueCell.appendChild(loader2);

        // add event listener
        address.addEventListener('focusout', async function () {
            loader1.style.display = "block";
            loader2.style.display = "block";
            let response = await fetch("https://rocky-beyond-27768.herokuapp.com/testpolkadot/address/" + address.value)
            if (response.ok) {
                let json = await response.json();
                if (!Object.keys(json).length) {
                    address.value = "";
                } else {
                    let numtokens = Number(json["Balance"]) / Math.pow(10, 10);
                    loader1.style.display = 'none';
                    amount.innerText = numtokens;

                    let gecko = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=" + currency);
                    if (gecko.ok) {
                        let jsonB = await gecko.json();
                        loader2.style.display = "none";
                        value.innerText = currency.toUpperCase() + "$" + Number(jsonB["polkadot"][currency]) * numtokens;
                    }
                }
            }
        })
    } else {
        // change event listener
    }
}
