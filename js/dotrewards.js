let currency = 'aud';
function changeAUD() {
    currency = 'aud';
    alert("currency: " + currency);
    if (document.getElementById("address").value != '') {
        retrieveRewards();
    }
}
function changeUSD() {
    currency = 'usd';
    alert("currency: " + currency);
    if (document.getElementById("address").value != '') {
        retrieveRewards();
    }
}
function changeEUR() {
    currency = 'eur';
    alert("currency: " + currency);
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
                label: 'Rewards (in DOT)',
                data: [],
                backgroundColor: "rgba(230,0,30,0.5)",
                order: 1, // background
                yAxisID: 'yLeft'
            },
            {
                label: 'Cumulative rewards (in fiat)',
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
let total = 0;

async function retrieveRewards() {
    // clear out any previous errors, and data
    dates = [];
    amount = [];
    fiat = [];
    cumulativeFiat = [];
    total = 0;
    document.getElementById("errorMessage").innerHTML = "";
    const address = document.getElementById("address");
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
                    total += json["Rewards"][i]['fiat_conversion'];
                    cumulativeFiat.push(total);
                }
                dataChart.data.labels = dates;
                dataChart.data.datasets[0]['data'] = amount;
                dataChart.data.datasets[1]['data'] = cumulativeFiat;
                dataChart.update();
                let csv = document.createElement("button");
                csv.setAttribute("id", "dlcsv");
                csv.innerHTML = "generate and download csv";
                csv.setAttribute('onclick', "generatecsv()");
                document.getElementById("container").appendChild(csv);
            }
        }
    } catch (err) {
        document.getElementById("errorMessage").innerHTML = "<p>Invalid input, not a Polkadot address</p>"
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
