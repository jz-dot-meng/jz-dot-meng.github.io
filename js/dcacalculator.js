let rowcount = 0;
const table = document.getElementById("assets");
const assetOptions = ["stock-only", "balanced stock-bond", "bond-only", "savings", "crypto"];

const ctx = document.getElementById("graph").getContext('2d')

let assetArr = [];

// issue to rethink - cant just take rowcount (which always is the latest row), some eventlisteners need their current row id?

function generateSpan(id) {
    let span = document.createElement('span');
    span.setAttribute("class", "input-group-text");
    span.setAttribute('id', id);
}

function addnewdca() {
    // get table, add new row
    let newrow = document.createElement("tr");
    newrow.setAttribute("id", rowcount);
    table.appendChild(newrow);
    // create initial investment, add to row
    let initialCell = document.createElement("td");
    newrow.appendChild(initialCell);
    let sign1 = generateSpan("initialSign" + rowcount);
    initialCell.appendChild(sign1);
    let initial = document.createElement("input");
    initial.setAttribute("id", "intial" + rowcount);
    initial.setAttribute("type", "number");
    initial.setAttribute("aria-describedby", "initialSign" + rowcount);
    initial.value = 10000; // initialise to $10000
    initialCell.appendChild(initial);
    // create amount form, add to row
    let amountCell = document.createElement("td");
    newrow.appendChild(amountCell);
    let sign2 = generateSpan("amountSign" + rowcount);
    amountCell.appendChild(sign2);
    let amount = document.createElement("input");
    amount.setAttribute("id", "amount" + rowcount);
    amount.setAttribute("type", "number");
    initial.setAttribute("aria-describedby", "amountSign" + rowcount);
    amount.value = 1000;
    amountCell.appendChild(amount);
    // add event listener for calculations!!! 
    // create period slider and converter, add to row
    let periodCell = document.createElement("td");
    newrow.appendChild(periodCell);
    let period = document.createElement("input");
    period.setAttribute("id", "period" + rowcount);
    period.setAttribute("type", "range");
    period.setAttribute("min", 1);
    period.setAttribute("max", 16);
    period.value = 4;
    periodCell.appendChild(period);
    let periodDisplay = document.createElement("p");
    periodDisplay.setAttribute("id", "periodDisp" + rowcount);
    weekConverter(period.value, periodDisplay);
    periodCell.appendChild(periodDisplay);
    // create asset type selector
    let assetCell = document.createElement("td");
    assetCell.setAttribute("id", "assetCell" + rowcount);
    newrow.appendChild(assetCell);
    let assetType = document.createElement("select");
    assetType.setAttribute("id", "assetType" + rowcount);
    for (let i = 0; i <= 4; i++) {
        let choice = document.createElement("option");
        choice.setAttribute("value", i);
        choice.innerText = assetOptions[i];
        assetType.appendChild(choice);
    }
    assetType.value = 1; // default to 1 (balanced)
    assetCell.appendChild(assetType);
    // create growth cell and slider
    let growthCell = document.createElement("td");
    newrow.appendChild(growthCell);
    let growth = document.createElement("input");
    growth.setAttribute("id", "growth" + rowcount);
    growth.setAttribute("type", "range");
    // initialise only
    growth.setAttribute("min", 4);
    growth.setAttribute("max", 9);
    growth.value = 7;
    growthCell.appendChild(growth);
    let growthDisplay = document.createElement("p");
    growthDisplay.setAttribute("id", "growthDisp" + rowcount);
    growthDisplay.innerHTML = "7%"; // initialise only
    growthCell.appendChild(growthDisplay);
    let removeCell = document.createElement("td");
    newrow.appendChild(removeCell);
    let remove = document.createElement("button");
    remove.setAttribute("id", "r" + rowcount);
    remove.innerHTML = "X";
    remove.setAttribute("onclick", "removerow(" + rowcount + ")")
    removeCell.appendChild(remove);

    // CLASS
    let newdca = new DCA(rowcount, initial.value, amount.value, period.value, growth.value);
    assetArr.push(newdca);
    newdca.recalculate();

    // EVENT LISTENERS 
    initial.addEventListener("blur", function () {
        newdca.initial = Number(initial.value);
        newdca.recalculate();
    })
    amount.addEventListener("blur", function () {
        newdca.amount = Number(amount.value);
        newdca.recalculate();
    })
    period.addEventListener("change", function () {
        weekConverter(period.value, periodDisplay);
        newdca.period = Number(period.value);
        newdca.recalculate();
    })
    assetType.addEventListener("change", function () {
        // refactor with row id
        let value = Number(assetType.value);
        switch (Number(value)) {
            case 0:
                // stock only, based on vanguard, avg 10%, slider 7-13
                growth.setAttribute("min", 7);
                growth.setAttribute("max", 13);
                growth.value = 10;
                growthDisplay.innerHTML = "10%";
                newdca.growth = Number(growth.value);
                newdca.recalculate();
                break;
            case 1:
                // balanced, based on vanguard, avg 7%, slider 4-9
                growth.setAttribute("min", 4);
                growth.setAttribute("max", 9);
                growth.value = 7;
                growthDisplay.innerHTML = "7%";
                newdca.growth = Number(growth.value);
                newdca.recalculate();
                break;
            case 2:
                // bond only, based on vanguard, avg 3%, slide 1-7
                growth.setAttribute("min", 2);
                growth.setAttribute("max", 7);
                growth.value = 3;
                growthDisplay.innerHTML = "3%";
                newdca.growth = Number(growth.value);
                newdca.recalculate();
                break;
            case 3:
                // cash savings - don't want to set decimal rate, so a currently-unrealistic 
                growth.setAttribute("min", 0);
                growth.setAttribute("max", 3);
                growth.value = 1;
                growthDisplay.innerHTML = "1%";
                newdca.growth = Number(growth.value);
                newdca.recalculate();
                break;
            case 4:
                growth.setAttribute("min", 0);
                growth.setAttribute("max", 200);
                growth.value = 60;
                growthDisplay.innerHTML = "60%";
                newdca.growth = Number(growth.value);
                newdca.recalculate();
                break;
        }
    });
    growth.addEventListener("change", function () {
        growthDisplay.innerHTML = growth.value + "%";
        // more calculation functions
        newdca.growth = Number(growth.value);
        newdca.recalculate();
    }, false);

    rowcount++;
}

function generateSpan(id) {
    let span = document.createElement('span');
    span.setAttribute("class", "input-group-text");
    span.setAttribute('id', id);
    span.innerText = '$';
    return span;
}

function weekConverter(value, display) {
    let month, week;
    month = Math.floor(value / 4);
    week = value % 4;
    let monthTxt, weekTxt;
    if (week == 1) {
        weekTxt = " week";
    } else {
        weekTxt = " weeks";
    }
    if (month == 1) {
        monthTxt = " month";
    } else {
        monthTxt = " months"
    }
    if (month == 0) {
        display.innerText = week + weekTxt;
    } else if (week == 0) {
        display.innerText = month + monthTxt;
    } else {
        display.innerText = month + monthTxt + ", " + week + weekTxt;
    }
}

function removerow(rowno) {
    let bye = document.getElementById(rowno);
    bye.remove();
}

const dataChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [],
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
            }
        }
    }
})

class DCA {
    constructor(id, initial, amount, period, growth) {
        this.id = Number(id);
        this.initial = Number(initial);
        this.amount = Number(amount);
        this.period = Number(period); // in weeks
        this.growth = Number(growth);
    }

    recalculate() {
        // calculate based on week growth
        // (100+(this.growth/52))/100 >> weekly growth
        let weeklydata = [];
        let weeklylabel = [];
        let amountInvested = this.initial;
        let total = amountInvested;
        // 5 year timeframe, EVENTUALL ALLOW CUSTOMISABILITY
        for (let p = 0; p < 5; p++) {
            for (let i = 1; i <= 52; i++) {
                if (i % this.period == 0) {
                    amountInvested += this.amount;
                    total += this.amount;
                }
                let growth = amountInvested * (Math.pow(((100 + this.growth) / 100.0), (1.0 / 52.0)) - 1.0);
                total += growth;
                if (i % 4 == 0) {
                    // push every month;
                    weeklydata.push(Math.floor(total));
                    weeklylabel.push("year" + p + ",week" + i)
                }
            }
        }
        console.log(weeklydata);
        // let data = {
        //     type: 'line',
        //     data: {
        //         labels: weeklylabel,
        //         datasets: [
        //             {
        //                 label: assetOptions[this.id] + ", " + this.growth + "%pa",
        //                 pointBackgroundColor: 'rgba(' + (this.growth * 10) + ',' + (this.period) + ',0,0.1)',
        //                 data: weeklydata,
        //             }
        //         ]
        //     },
        // }
        if (dataChart.data.datasets[this.id] == null) {
            let r = Math.floor(Math.random() * 255);
            let g = Math.floor(Math.random() * 255);
            let b = Math.floor(Math.random() * 255);
            dataChart.data["labels"] = weeklylabel;
            dataChart.data.datasets.push({
                label: assetOptions[document.getElementById("assetType" + this.id).value] + ", " + this.growth + "%pa, invest every " + this.period + " weeks",
                pointBackgroundColor: 'rgba(' + r + ',' + g + ',' + b + ',0.5)',
                borderColor: 'rgba(' + r + ',' + g + ',' + b + ',0.5)',
                data: weeklydata,
            })

        } else {
            dataChart.data.datasets[this.id]['label'] = assetOptions[document.getElementById("assetType" + this.id).value] + ", " + this.growth + "%pa, invest every " + this.period + " weeks";
            dataChart.data.datasets[this.id]['data'] = weeklydata;
        }
        dataChart.update();
    }
}
