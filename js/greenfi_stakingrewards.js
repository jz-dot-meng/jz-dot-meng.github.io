let currency = 'aud';
const displays = [{ name: 'Polkadot', ticker: 'DOT', function: retrieveDotRewards }, { name: 'Stellar', ticker: 'yXLM', function: retreiveYXlmRewards }, { name: 'Tezos', ticker: 'XTZ', function: retrieveXtzRewards }]
const stakingObjects = [];

function changeCurr(cur) {
    currency = cur;
    for (let i = 0; i < stakingObjects.length; i++) {
        stakingObjects[i].dataChart.options.scales.yRight.ticks.callback = function (value, index, values) {
            return value.toLocaleString("en-US", { style: "currency", currency: currency.toUpperCase() });
        };
        stakingObjects[i].dataChart.update();
        if (document.getElementById(`${stakingObjects[i].ticker.toLowerCase()}-address`).value != '') {
            stakingObjects[i].retrieveFunction(stakingObjects);
        }
    }
}

class Staking {
    // ui elements
    dataChart;
    tableStyle;
    tableDataCells;
    errorMessage;
    loader;
    // data 
    name;
    ticker;
    retrieveFunction;
    data = {
        dates: [],
        amount: [],
        fiat: [],
        cumulativeFiat: [],
        totalFiat: 0,
        totalCoin: 0
    }

    constructor(name, ticker, retrieveFunction) {
        this.name = name;
        this.ticker = ticker;
        this.retrieveFunction = retrieveFunction;
        this.createObjects();
    }

    // UI init
    createObjects = () => {
        // create top element
        const topDivEl = document.createElement('div');
        topDivEl.setAttribute('id', this.name + '-top');
        topDivEl.classList.add('carousel-item');
        document.getElementById('carousel-top').appendChild(topDivEl);

        // create canvas
        const canvas = document.createElement('canvas');
        canvas.setAttribute('id', this.ticker.toLowerCase() + '-graph');
        const ctx = canvas.getContext('2d');
        this.dataChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [], // dates
                datasets: [
                    {
                        label: `Daily rewards (in ${this.ticker})`,
                        data: [],
                        backgroundColor: "rgba(230,0,30,0.5)",
                        order: 1, // background
                        yAxisID: 'yLeft'
                    },
                    {
                        label: 'Cumulative rewards based on latest price (in fiat)',
                        data: [],
                        backgroundColor: "rgba(0,35,230,0.5)",
                        order: 0,
                        type: 'line',
                        yAxisID: 'yRight'
                    }
                ]
            },
            options: {
                scales: {
                    yLeft: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                    },
                    yRight: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        ticks: {
                            callback: function (value, index, values) {
                                return value.toLocaleString("en-US", { style: "currency", currency: currency.toUpperCase() })
                            }
                        }
                    }
                }
            }
        })
        topDivEl.appendChild(canvas);

        // create bottom element
        const bottomDivEl = document.createElement('div');
        bottomDivEl.setAttribute('id', this.name + '-bottom');
        bottomDivEl.classList.add('carousel-item');
        document.getElementById('carousel-bottom').appendChild(bottomDivEl);

        // create flex
        const flex = document.createElement('div');
        flex.classList.add('info-flex');
        bottomDivEl.appendChild(flex);
        const left = document.createElement('div');
        left.classList.add('left');
        const right = document.createElement('div');
        right.classList.add('right');
        flex.appendChild(left);
        flex.appendChild(right);

        // create table
        const table = document.createElement('table');
        table.setAttribute('id', `${this.name}-table`);
        this.tableStyle = table;
        this.tableStyle.style.visibility = 'hidden';
        right.appendChild(table);
        const rowData = ['Wallet balance:', 'Total rewards:', 'Average daily reward:', 'APY based on average daily reward:', 'APY based on last daily reward:'];
        const rowIds = ['walletBal', 'totalRewards', 'avgDaily', 'apyAvg', 'apyLast']
        this.tableDataCells = {};
        for (let i = 0; i < rowData.length; i++) {
            const row = document.createElement('tr');
            table.appendChild(row);
            const dataLabel = document.createElement('td');
            dataLabel.innerText = rowData[i];
            row.appendChild(dataLabel);
            const dataCell = document.createElement('td');
            dataCell.setAttribute('id', `${this.ticker.toLowerCase()}-${rowIds[i]}`);
            this.tableDataCells[`${rowIds}`] = dataCell; // will this work?
            row.appendChild(dataCell);
        }

        // create input
        const inputContainer = document.createElement('div');
        left.appendChild(inputContainer);
        const label = document.createElement('label');
        label.setAttribute('for', `${this.ticker.toLowerCase()}-address`);
        label.innerText = `${this.name} Address:`
        inputContainer.appendChild(label);
        const input = document.createElement('input');
        input.setAttribute('id', `${this.ticker.toLowerCase()}-address`);
        input.type = 'text';
        input.addEventListener('blur', () => { this.retrieveFunction(this) });
        input.style.width = '360px'
        inputContainer.appendChild(input);

        // create error message div
        const error = document.createElement('div');
        error.setAttribute('id', `${this.ticker.toLowerCase()}-error`);
        left.appendChild(error);
        this.errorMessage = error;
        // create loader
        const loader = document.createElement('div');
        loader.setAttribute('id', `${this.ticker.toLowerCase()}-loader`);
        loader.classList.add('loader');
        left.appendChild(loader);
        this.loader = loader;
        this.loader.style.display = 'none';

    }

    reset = () => {
        this.tableStyle.style.visibility = 'hidden';
        this.errorMessage.innerHTML = '';
        this.dataChart.data.labels = [];
        this.dataChart.data.datasets[0].data = [];
        this.dataChart.data.datasets[1].data = [];
    }
}


const createCards = () => {
    for (let i = 0; i < displays.length; i++) {
        const stakingObj = new Staking(displays[i].name, displays[i].ticker, displays[i].function);
        stakingObjects.push(stakingObj);
    }
}


const init = () => {
    let displayNames = displays.map((item) => item.name)
    let data = displayNames.toString();
    document.getElementById('selector').setAttribute('info', data);
    createCards();
}
init();
const reInit = () => {
    for (let i = 0; i < stakingObjects.length; i++) {
        stakingObjects[i].reset();
    }
}
reInit();

async function retrieveDotRewards(staking) {
    staking.reset();
    const address = document.getElementById(`${staking.ticker.toLowerCase()}-address`);
    // get dot price
    let latestprice = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=" + currency)
    if (latestprice.ok) {
        let priceJson = await latestprice.json();
        latestprice = priceJson['polkadot'][currency];
    }
    try {
        staking.loader.style.display = 'block';
        let response = await fetch('https://jz-dot-meng-wbapi.herokuapp.com/testpolkadot/rewards/' + address.value + "&currency=" + currency);
        if (response.status == 200) {
            let json = await response.json();
            if (!Object.keys(json).length) {
                // ie if json is empty, indicating an error
                address.value = "";
            } else if (typeof json["Rewards"][0] == 'string') {
                // ie has a single string that says not a staking address
                document.getElementById(`${staking.ticker.toLowerCase()}-error`).innerHTML = "<p>Not a staking address - no staking rewards found</p>";
                address.value = "";
            } else {
                for (let i = json["Rewards"].length - 1; i >= 0; i--) {
                    staking.data.dates.push(json["Rewards"][i]['reward_date']);
                    staking.data.amount.push(json["Rewards"][i]['reward_amount']);
                    staking.data.fiat.push(json["Rewards"][i]['fiat_conversion']);
                    staking.data.totalFiat += json["Rewards"][i]['reward_amount'] * latestprice;
                    staking.data.totalCoin += json["Rewards"][i]['reward_amount'];
                    staking.data.cumulativeFiat.push(staking.data.totalFiat);
                }
                staking.dataChart.data.labels = staking.data.dates;
                staking.dataChart.data.datasets[0]['data'] = staking.data.amount;
                staking.dataChart.data.datasets[1]['data'] = staking.data.cumulativeFiat;
                staking.dataChart.update();
                if (document.getElementById('dlcsv') == undefined) {
                    let csv = document.createElement("button");
                    csv.setAttribute("id", "dlcsv");
                    csv.innerHTML = "generate and download csv";
                    csv.setAttribute('onclick', "generatecsv()");
                    document.getElementById("container").appendChild(csv);
                }
                // calculate avg, estimated apy
                let avgCoin = staking.data.totalCoin / staking.data.dates.length;
                let avgFiat = staking.data.totalFiat / staking.data.dates.length;
                let balance;
                let avgApy;
                let lastApy;
                // get coin balance
                let wallet = await fetch("https://jz-dot-meng-wbapi.herokuapp.com/testpolkadot/address/" + address.value)
                if (wallet.ok) {
                    let jsonB = await wallet.json();
                    balance = jsonB['Balance'] / Math.pow(10, 10);
                    avgApy = Math.pow((1 + (avgCoin / balance)), 365) - 1;
                    lastApy = Math.pow((1 + (json['Rewards'][0]['reward_amount'] / balance)), 365) - 1;
                }
                if (balance == undefined) {
                    // What is this for again??
                    // loader1.style.display = "none";
                    //document.getElementById('r2').style.visibility = "visible";
                    //document.getElementById("avgDaily").innerText = avgCoin.toFixed(5) + " DOT, " + new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase(), minimumFractionDigits: 4 }).format(avgFiat);
                } else {
                    staking.loader.style.display = "none";
                    staking.tableStyle.style.visibility = 'visible'
                    document.getElementById(`${this.ticker.toLowerCase()}-walletBal`).innerText = `${balance} ${staking.ticker}`;
                    document.getElementById(`${this.ticker.toLowerCase()}-totalRewards`).innerText = `${staking.data.totalCoin} ${staking.ticker}`;
                    document.getElementById(`${this.ticker.toLowerCase()}-avgDaily`).innerText = `${avgCoin.toFixed(5)} ${staking.ticker} ${new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase(), minimumFractionDigits: 4 }).format(avgFiat)}`;
                    document.getElementById(`${this.ticker.toLowerCase()}-apyAvg`).innerText = avgApy.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 4 });
                    document.getElementById(`${this.ticker.toLowerCase()}-apyLast`).innerText = lastApy.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 4 });
                }
            }
        } else {
            throw new Error(response.error);
        }
    } catch (err) {
        staking.loader.style.display = 'none';
        document.getElementById(`${staking.ticker.toLowerCase()}-error`).innerHTML = `<p>${err}</p>`
        address.value = "";
    }
}
async function retreiveYXlmRewards(staking) {
    staking.reset()
    const address = document.getElementById(`${staking.ticker.toLowerCase()}-address`);
    // get dot price
    let latestprice = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=" + currency)
    if (latestprice.ok) {
        let priceJson = await latestprice.json();
        latestprice = priceJson['stellar'][currency];
    }
    try {
        staking.loader.style.display = 'block';
        let response = await fetch('https://jz-dot-meng-wbapi.herokuapp.com/teststellar/rewards/' + address.value + "&currency=" + currency);
        if (response.status == 200) {
            let json = await response.json();
            if (!Object.keys(json).length) {
                // ie if json is empty, indicating an error
                address.value = "";
            } else if (typeof json["Rewards"][0] == 'string') {
                // ie has a single string that says not a staking address
                document.getElementById(`${staking.ticker.toLowerCase()}-error`).innerHTML = "<p>Not a staking address - no staking rewards found</p>";
                address.value = "";
            } else {
                for (let i = 0; i < json["Rewards"].length; i++) {
                    staking.data.dates.push(json["Rewards"][i]['reward_date']);
                    staking.data.amount.push(Number(json["Rewards"][i]['reward_amount']));
                    staking.data.fiat.push(json["Rewards"][i]['fiat_conversion']);
                    staking.data.totalFiat += Number(json["Rewards"][i]['reward_amount']) * latestprice;
                    staking.data.totalCoin += Number(json["Rewards"][i]['reward_amount']);
                    staking.data.cumulativeFiat.push(staking.data.totalFiat);
                }
                staking.dataChart.data.labels = staking.data.dates;
                staking.dataChart.data.datasets[0]['data'] = staking.data.amount;
                staking.dataChart.data.datasets[1]['data'] = staking.data.cumulativeFiat;
                staking.dataChart.update();
                if (document.getElementById('dlcsv') == undefined) {
                    let csv = document.createElement("button");
                    csv.setAttribute("id", "dlcsv");
                    csv.innerHTML = "generate and download csv";
                    csv.setAttribute('onclick', "generatecsv()");
                    document.getElementById("container").appendChild(csv);
                }
                // calculate avg, estimated apy
                let avgCoin = staking.data.totalCoin / staking.data.dates.length;
                let avgFiat = staking.data.totalFiat / staking.data.dates.length;
                let balance;
                let avgApy;
                let lastApy;
                // get coin balance
                let wallet = await fetch("https://jz-dot-meng-wbapi.herokuapp.com/teststellar/address/" + address.value)
                if (wallet.ok) {
                    let jsonB = await wallet.json();
                    let index;
                    for (let i = 0; i < jsonB['Balances'].length; i++) {
                        if (jsonB['Balances'][i]['Asset_code'] == 'yXLM') index = i;
                    }
                    balance = jsonB['Balances'][index]['Balance'];
                    avgApy = Math.pow((1 + (avgCoin / balance)), 365) - 1;
                    lastApy = Math.pow((1 + (json['Rewards'][0]['reward_amount'] / balance)), 365) - 1;
                }
                if (balance == undefined) {
                    // What is this for again??
                    // loader1.style.display = "none";
                    //document.getElementById('r2').style.visibility = "visible";
                    //document.getElementById("avgDaily").innerText = avgCoin.toFixed(5) + " DOT, " + new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase(), minimumFractionDigits: 4 }).format(avgFiat);
                } else {
                    staking.loader.style.display = "none";
                    staking.tableStyle.style.visibility = 'visible'
                    document.getElementById(`${this.ticker.toLowerCase()}-walletBal`).innerText = `${balance} ${staking.ticker}`;
                    document.getElementById(`${this.ticker.toLowerCase()}-totalRewards`).innerText = `${staking.data.totalCoin} ${staking.ticker}`;
                    document.getElementById(`${this.ticker.toLowerCase()}-avgDaily`).innerText = `${avgCoin.toFixed(5)} ${staking.ticker} ${new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase(), minimumFractionDigits: 4 }).format(avgFiat)}`;
                    document.getElementById(`${this.ticker.toLowerCase()}-apyAvg`).innerText = avgApy.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 4 });
                    document.getElementById(`${this.ticker.toLowerCase()}-apyLast`).innerText = lastApy.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 4 });
                }
            }
        } else {
            throw new Error(response.error);
        }
    } catch (err) {
        staking.loader.style.display = 'none';
        document.getElementById(`${staking.ticker.toLowerCase()}-error`).innerHTML = `<p>${err}</p>`
        address.value = "";
    }
}
async function retrieveXtzRewards(staking) {
    staking.reset()
    const address = document.getElementById(`${staking.ticker.toLowerCase()}-address`);
    // get dot price
    let latestprice = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=tezos&vs_currencies=" + currency)
    if (latestprice.ok) {
        let priceJson = await latestprice.json();
        latestprice = priceJson['tezos'][currency];
    }
    try {
        staking.loader.style.display = 'block';
        let response = await fetch('https://jz-dot-meng-wbapi.herokuapp.com/testtezos/rewards/' + address.value + "&currency=" + currency);
        if (response.status == 200) {
            let json = await response.json();
            if (!Object.keys(json).length) {
                // ie if json is empty, indicating an error
                address.value = "";
            } else if (typeof json["Rewards"][0] == 'string') {
                // ie has a single string that says not a staking address
                document.getElementById(`${staking.ticker.toLowerCase()}-error`).innerHTML = "<p>Not a staking address - no staking rewards found</p>";
                address.value = "";
            } else {
                for (let i = 0; i < json["Rewards"].length; i++) {
                    staking.data.dates.push(json["Rewards"][i]['reward_date']);
                    staking.data.amount.push(Number(json["Rewards"][i]['reward_amount']));
                    staking.data.fiat.push(json["Rewards"][i]['fiat_conversion']);
                    staking.data.totalFiat += Number(json["Rewards"][i]['reward_amount']) * latestprice;
                    staking.data.totalCoin += Number(json["Rewards"][i]['reward_amount']);
                    staking.data.cumulativeFiat.push(staking.data.totalFiat);
                }
                staking.dataChart.data.labels = staking.data.dates;
                staking.dataChart.data.datasets[0]['data'] = staking.data.amount;
                staking.dataChart.data.datasets[1]['data'] = staking.data.cumulativeFiat;
                staking.dataChart.update();
                if (document.getElementById('dlcsv') == undefined) {
                    let csv = document.createElement("button");
                    csv.setAttribute("id", "dlcsv");
                    csv.innerHTML = "generate and download csv";
                    csv.setAttribute('onclick', "generatecsv()");
                    document.getElementById("container").appendChild(csv);
                }
                // calculate avg, estimated apy
                let avgCoin = staking.data.totalCoin / staking.data.dates.length;
                let avgFiat = staking.data.totalFiat / staking.data.dates.length;
                let balance;
                let avgApy;
                let lastApy;
                // get coin balance
                let wallet = await fetch("https://jz-dot-meng-wbapi.herokuapp.com/testtezos/address/" + address.value)
                if (wallet.ok) {
                    let jsonB = await wallet.json();
                    balance = jsonB['Balance'];
                    avgApy = Math.pow((1 + (avgCoin / balance)), 365) - 1;
                    lastApy = Math.pow((1 + (json['Rewards'][0]['reward_amount'] / balance)), 365) - 1;
                }
                if (balance == undefined) {
                    // What is this for again??
                    // loader1.style.display = "none";
                    //document.getElementById('r2').style.visibility = "visible";
                    //document.getElementById("avgDaily").innerText = avgCoin.toFixed(5) + " DOT, " + new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase(), minimumFractionDigits: 4 }).format(avgFiat);
                } else {
                    staking.loader.style.display = "none";
                    staking.tableStyle.style.visibility = 'visible'
                    document.getElementById(`${this.ticker.toLowerCase()}-walletBal`).innerText = `${balance} ${staking.ticker}`;
                    document.getElementById(`${this.ticker.toLowerCase()}-totalRewards`).innerText = `${staking.data.totalCoin} ${staking.ticker}`;
                    document.getElementById(`${this.ticker.toLowerCase()}-avgDaily`).innerText = `${avgCoin.toFixed(5)} ${staking.ticker} ${new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase(), minimumFractionDigits: 4 }).format(avgFiat)}`;
                    document.getElementById(`${this.ticker.toLowerCase()}-apyAvg`).innerText = avgApy.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 4 });
                    document.getElementById(`${this.ticker.toLowerCase()}-apyLast`).innerText = lastApy.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 4 });
                }
            }
        } else {
            throw new Error(response.error);
        }
    } catch (err) {
        staking.loader.style.display = 'none';
        document.getElementById(`${staking.ticker.toLowerCase()}-error`).innerHTML = `<p>${err}</p>`
        address.value = "";
    }
}
Date().to

function generatecsv() {
    const strArr = [];
    for (let i = 0; i < stakingObjects.length; i++) {
        if (stakingObjects[i].data.amount.length == 0 || stakingObjects[i].data.fiat.length == 0) continue;
        let str = 'Date, Reward ' + stakingObjects[i].ticker + ', ' + currency.toUpperCase() + ' Fiat conversion\n';
        for (let j = 0; j < stakingObjects[i].data.dates.length; j++) {
            str += new Date(stakingObjects[i].data.dates[j]).toLocaleDateString() + ',' + stakingObjects[i].data.amount[j] + ',' + stakingObjects[i].data.fiat[j] + '\n';
        }
        strArr.push(str);
    }
    let downloadElement = document.createElement('a');
    downloadElement.href = "data:text/csv;charset=utf-8," + encodeURI(strArr.join('\n\n'));
    downloadElement.target = "_blank"; // sets/retrieves window/frame AT WHICH to target content
    downloadElement.download = Date.now() + "-stakingRewards.csv";
    downloadElement.click();
}

const selectAction = () => {
    let display = document.getElementById('selector-display').innerText;
    let displayName = displays.map(item => item.name)
    let index = displayName.indexOf(display);
    document.getElementById('carousel-top').style.setProperty('--current-display', index);
    document.getElementById('carousel-bottom').style.setProperty('--current-display', index);
}