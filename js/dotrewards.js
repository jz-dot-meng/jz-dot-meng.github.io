let currency = 'aud';

function changeAUD() {
    currency = 'aud';
    dataChart.options.scales.yRight.ticks.callback = function (value, index, values) {
        return value.toLocaleString("en-US", { style: "currency", currency: currency.toUpperCase() });
    };
    dataChart.update();
    if (document.getElementById("address").value != '') {
        retrieveRewards();
    }
}
function changeUSD() {
    currency = 'usd';
    dataChart.options.scales.yRight.ticks.callback = function (value, index, values) {
        return value.toLocaleString("en-US", { style: "currency", currency: currency.toUpperCase() });
    };
    dataChart.update();
    if (document.getElementById("address").value != '') {
        retrieveRewards();
    }
}
function changeEUR() {
    currency = 'eur';
    dataChart.options.scales.yRight.ticks.callback = function (value, index, values) {
        return value.toLocaleString("en-US", { style: "currency", currency: currency.toUpperCase() });
    };
    dataChart.update();
    if (document.getElementById("address").value != '') {
        retrieveRewards();
    }
}

const ctx = document.getElementById('graph').getContext('2d');
const dataChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [], // dates
        datasets: [
            {
                label: 'Daily rewards (in DOT)',
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

let dates = [];
let amount = [];
let fiat = []
let cumulativeFiat = [];
let totalFiat = 0;
let totalCoin = 0;

async function retrieveRewards() {
    // clear out any previous errors
    document.getElementById('r1').style.visibility = "hidden";
    document.getElementById('r2').style.visibility = "hidden";
    document.getElementById('r3').style.visibility = "hidden";
    document.getElementById('r4').style.visibility = "hidden";
    document.getElementById('r5').style.visibility = "hidden";
    dates = [];
    amount = [];
    fiat = [];
    cumulativeFiat = [];
    totalFiat = 0;
    totalCoin = 0;
    document.getElementById("errorMessage").innerHTML = "";
    const address = document.getElementById("address");
    // get dot price
    let latestprice = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=" + currency)
    if (latestprice.ok) {
        let priceJson = await latestprice.json();
        latestprice = priceJson['polkadot'][currency];
    }
    try {
        let response = await fetch('https://rocky-beyond-27768.herokuapp.com/testpolkadot/rewards/' + address.value + "&currency=" + currency);
        if (response.ok) {
            let json = await response.json();
            if (!Object.keys(json).length) {
                // ie if json is empty, indicating an error
                address.value = "";
            } else if (typeof json["Rewards"][0] == 'string') {
                // ie has a single string that says not a staking address
                document.getElementById("errorMessage").innerHTML = "<p>Not a staking address - no staking rewards found</p>";
                address.value = "";
            } else {
                for (let i = json["Rewards"].length - 1; i >= 0; i--) {
                    dates.push(json["Rewards"][i]['reward_date']);
                    amount.push(json["Rewards"][i]['reward_amount']);
                    fiat.push(json["Rewards"][i]['fiat_conversion']);
                    totalFiat += json["Rewards"][i]['reward_amount'] * latestprice;
                    totalCoin += json["Rewards"][i]['reward_amount'];
                    cumulativeFiat.push(totalFiat);
                }
                dataChart.data.labels = dates;
                dataChart.data.datasets[0]['data'] = amount;
                dataChart.data.datasets[1]['data'] = cumulativeFiat;
                dataChart.update();
                if (document.getElementById('dlcsv') == undefined) {
                    let csv = document.createElement("button");
                    csv.setAttribute("id", "dlcsv");
                    csv.innerHTML = "generate and download csv";
                    csv.setAttribute('onclick', "generatecsv()");
                    document.getElementById("container").appendChild(csv);
                }
                // create loader
                let loader1 = document.createElement('div');
                loader1.setAttribute("id", "loaderOne");
                loader1.setAttribute("class", 'loader');
                document.getElementById('right').appendChild(loader1);
                // calculate avg, estimated apy
                let avgCoin = totalCoin / dates.length;
                let avgFiat = totalFiat / dates.length;
                let balance;
                let avgApy;
                let lastApy;
                // get coin balance
                let wallet = await fetch("https://rocky-beyond-27768.herokuapp.com/testpolkadot/address/" + address.value)
                if (wallet.ok) {
                    let jsonB = await wallet.json();
                    balance = jsonB['Balance'] / Math.pow(10, 10);
                    avgApy = Math.pow((1 + (avgCoin / balance)), 365) - 1;
                    lastApy = Math.pow((1 + (json['Rewards'][0]['reward_amount'] / balance)), 365) - 1;
                }
                if (balance == undefined) {
                    loader1.style.display = "none";
                    document.getElementById('r2').style.visibility = "visible";
                    document.getElementById("avgDaily").innerText = avgCoin.toFixed(5) + " DOT, " + new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase(), minimumFractionDigits: 4 }).format(avgFiat);
                } else {
                    loader1.style.display = "none";
                    document.getElementById('r1').style.visibility = "visible";
                    document.getElementById('r2').style.visibility = "visible";
                    document.getElementById('r3').style.visibility = "visible";
                    document.getElementById('r4').style.visibility = "visible";
                    document.getElementById('r5').style.visibility = "visible";
                    document.getElementById("walletBal").innerText = balance + " DOT";
                    document.getElementById("totalRew").innerText = totalCoin + " DOT";
                    document.getElementById("avgDaily").innerText = avgCoin.toFixed(5) + " DOT, " + new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase(), minimumFractionDigits: 4 }).format(avgFiat);
                    document.getElementById("apyAvg").innerText = avgApy.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 4 });
                    document.getElementById('apyLast').innerText = lastApy.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 4 });
                }
            }
        }

    } catch (err) {
        document.getElementById("errorMessage").innerHTML = "<p>Invalid input, or a server error</p>"
        address.value = "";
    }
}


function generatecsv() {
    let str = ',Date, Reward (DOT), ' + currency.toUpperCase() + ' Fiat conversion\n';
    for (let i = 0; i < dates.length; i++) {
        str += dates[i] + ',' + amount[i] + ',' + fiat[i] + '\n';
    }
    let downloadElement = document.createElement('a');
    downloadElement.href = "data:text/csv;charset=utf-8" + encodeURI(str);
    downloadElement.target = "_blank"; // sets/retrieves window/frame AT WHICH to target content
    downloadElement.download = Date.now() + "-polkadotRewards.csv";
    downloadElement.click();
}
