

const reserve = document.getElementById("reserve");
reserve.addEventListener('change', () => {
    recalculate();
})
const flatrate = document.getElementById("flatrate");
flatrate.addEventListener('change', () => {
    recalculate();
})
const flexbasecommission = document.getElementById("flexbasecommission");
flexbasecommission.addEventListener('change', () => {
    recalculate();
})
const flexabovecommission = document.getElementById('flexabovecommission');
flexabovecommission.addEventListener('change', () => {
    recalculate();
})

const titleConfig = (tooltipItems) => {
    // HACK - use the label for the first set
    let labelTitle = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0 }).format(tooltipItems[0].label);
    if (parseInt(tooltipItems[0].label) > reserve.value) {
        let valueover = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0 }).format(tooltipItems[0].label - reserve.value);
        let percentover = (tooltipItems[0].label - reserve.value) * 100 / reserve.value;
        labelTitle += ' : ' + valueover + ' or ' + percentover + '% over reserve';
    }
    else if (parseInt(tooltipItems[0].label) < reserve.value) {
        let valueunder = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0 }).format(reserve.value - tooltipItems[0].label);
        let percentunder = (reserve.value - tooltipItems[0].label) * 100 / reserve.value;
        labelTitle += ' : ' + valueunder + ' or ' + percentunder + '% under reserve';
    }
    return labelTitle;
}
const labelConfig = (tooltipItems) => {
    let label = tooltipItems.dataset.label || '';

    if (label) {
        label += ': ';
    }
    if (tooltipItems.parsed.y !== null) {
        label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tooltipItems.parsed.y);
    }
    return label;
}

// initialise graph
const ctx = document.getElementById("graph").getContext('2d');
const dataChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [],
    },
    options: {
        interaction: {
            intersect: false,
            mode: 'index'
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'sale price'
                },
                ticks: {
                    beginAtZero: false,
                    callback: function (value) {
                        return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0 }).format(this.getLabelForValue(value))
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'commission'
                },
                ticks: {
                    beginAtZero: false,
                    callback: function (value) {
                        return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0 }).format(value)
                    },
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    title: titleConfig,
                    label: labelConfig,
                },
            },
        }
    }
})

// set default initial
function init() {
    reserve.value = 800000;
    flatrate.value = 1.5;
    flexbasecommission.value = 1.2;
    flexabovecommission.value = 3.25;
    recalculate();
}
init();

// x = sale price, from 80% reserve to 200%
// y = commission

function recalculate() {
    // delete prev data
    dataChart.data.datasets = [];

    let salepricelabel = [];
    let flatcommission = [];
    let incentivisedcommission = [];
    let start = reserve.value * 0.8;
    for (let i = start; i < reserve.value * 1.5; i += 5000) {
        // let salepriceformat = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0 }).format(i);
        // if (i > reserve.value) {
        //     let valueover = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0 }).format(i - reserve.value);
        //     let percentover = (i - reserve.value) * 100 / reserve.value;
        //     salepriceformat += ' : ' + valueover + ' or ' + percentover + '% over reserve';
        // }
        salepricelabel.push(i);

        // flat rate
        let flat = i * flatrate.value / 100;
        flatcommission.push(flat);

        // incentivised
        let incentivised;
        if (i < reserve.value) {
            incentivised = i * flexbasecommission.value / 100;
            incentivisedcommission.push(incentivised);
        } else {
            let above = i - reserve.value;
            incentivised = (reserve.value * flexbasecommission.value / 100) + (above * flexabovecommission.value / 100);
            incentivisedcommission.push(incentivised);
        }
    }

    // create graphs
    dataChart.data["labels"] = salepricelabel;
    // flat
    let r1 = Math.floor(Math.random() * 255);
    let g1 = Math.floor(Math.random() * 255);
    let b1 = Math.floor(Math.random() * 255);
    dataChart.data.datasets.push({
        label: 'flat rate commission',
        pointBackgroundColor: 'rgba(' + r1 + ',' + g1 + ',' + b1 + ',0.5)',
        borderColor: 'rgba(' + r1 + ',' + g1 + ',' + b1 + ',0.5)',
        data: flatcommission,
    })
    // incentivised
    let r2 = Math.floor(Math.random() * 255);
    let g2 = Math.floor(Math.random() * 255);
    let b2 = Math.floor(Math.random() * 255);
    dataChart.data.datasets.push({
        label: 'incentivised commission',
        pointBackgroundColor: 'rgba(' + r2 + ',' + g2 + ',' + b2 + ',0.5)',
        borderColor: 'rgba(' + r2 + ',' + g2 + ',' + b2 + ',0.5)',
        data: incentivisedcommission,
    })
    dataChart.options.plugins.tooltip.title = titleConfig;
    dataChart.options.plugins.tooltip.label = labelConfig;
    dataChart.update();
}
