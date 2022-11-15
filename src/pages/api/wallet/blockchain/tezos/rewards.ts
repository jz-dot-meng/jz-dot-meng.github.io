import { NextApiRequest, NextApiResponse } from "next";
import { timeout } from "pages/api/utils/constants/datetime-utils";


const tezReturnRewards=async (ADDR:string, response:NextApiResponse) =>{
    // check account for delegate
    try {
        // console.log('fetching xtz rewards')
        const dataObj:{Message:string,Address:string,Rewards:any[]} = { "Message": "Successfully connected to the TzStats API and retrieved payment rewards from Tezos delegate", 'Address': ADDR, 'Rewards': [] };

        const data = await fetch("https://api.tzstats.com/explorer/account/" + ADDR);
        if (data.status !== 200) throw new Error(data.statusText);
        let json = await data.json();

        if (!json['is_delegated']) {
            const noReward = JSON.parse(JSON.stringify(dataObj));
            response.json(noReward);
        }

        const delegate = json.baker;
        let cursor = 0;
        let isFinished = false;
        const transactions = [];
        while (!isFinished) {
            // console.log('fetching transactions...')
            await timeout(200)
            const transactionFetch = await fetch(`https://api.tzstats.com/explorer/account/${ADDR}/operations?limit=200&cursor=${cursor}`);
            if (transactionFetch.status !== 200) throw new Error(transactionFetch.statusText)
            const currentCursorTransactions = await transactionFetch.json();
            // console.log('transactions @currentCursor', currentCursorTransactions)
            if (currentCursorTransactions.length === 0) {
                isFinished = true;
            } else {
                transactions.push(...currentCursorTransactions);
                cursor++;
            }
        }
        let tempArr = transactions.filter(item => item.type === 'transaction' && item.sender === delegate);
        if (tempArr.length == 0) {
            // delegate uses a different payout account
            const delegateAccOps = await fetch(`https://api.tzstats.com/explorer/account/${delegate}/operations?limit=200`);
            const delTransactionsData = await delegateAccOps.json();
            let delTransactions = delTransactionsData.filter((item:any) => item.type === 'transaction')
            // console.log(delTransactions)
            const delAddrs:any = {};
            delTransactions.forEach((item:any) => {
                if (delAddrs.hasOwnProperty(item.receiver)) {
                    delAddrs[(item.receiver)]++
                } else {
                    delAddrs[(item.receiver)] = 0;
                }
            })
            // find account with most transactions, ASSUME it is payout - sort to test first
            Object.keys(delAddrs).sort((a, b) => delAddrs[b] - delAddrs[a]);
            let payout;
            for (let i = 0; i < Object.keys(delAddrs).length; i++) {
                tempArr = transactions.filter(item => item.sender === Object.keys(delAddrs)[i]);
                // console.log(tempArr)
                if (tempArr.length > 0) {
                    payout = Object.keys(delAddrs)[i];
                    console.log('found payout addr', Object.keys(delAddrs)[i])
                    break;
                }
            }
        }
        if (tempArr.length == 0) {
            const noReward = JSON.parse(JSON.stringify(dataObj));
            response.json(noReward);
        } else {
            // console.log(tempArr);
            // find start/end dates for coingecko api call, in unix timestamp format
            // let end = Date.now() / 1000;//new Date(tempArr[(tempArr.length - 1)]['time']).getTime() / 1000;
            // let firstRecord = new Date(tempArr[0]['time']).getTime() / 1000
            // let start;
            // if (end - firstRecord < 7776000) {
            //     start = end - 7777000; // add extra just to ensure it will return correctly
            // } else {
            //     start = (60 * 60 * 24) * Math.floor(firstRecord / (60 * 60 * 24)) - (60 * 60 * 24);
            // }
            // let histPrices = [];
            // let currentPrice = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=tezos&vs_currencies=" + currency.toLowerCase()) // should the validation occur here, or in the clientside program?
            //     .then(res => res.json())
            //     .then(res => (function () {
            //         return res['tezos']['aud'];
            //     })());
            // await fetch('https://api.coingecko.com/api/v3/coins/tezos/market_chart/range?vs_currency=' + currency.toLowerCase() + "&from=" + start + "&to=" + end)
            //     .then(res => res.json())
            //     .then(resp => (function () {
            //         histPrices = resp["prices"];
            //         // convert date data from millisecond_unix to datestring, from the coingecko response
            //         histPrices.forEach(item => item[0] = new Date(item[0]).toDateString())
            //         let currentDate = new Date().toDateString(); // coingecko historic data doesn't return current day
            for (let i = tempArr.length - 1; i >= 0; i--) {
                // convert unix to milliseconds for date formatting, necessary to do so?
                let date = new Date(tempArr[i]['time']).toDateString();
                let amount = tempArr[i]['volume'];
                // let fiat;
                // if (date == currentDate) {
                //     fiat = currentPrice * amount;
                // } else {
                //     // binary search instead of loop?
                //     let index = binaryDateSearch(date, histPrices, 0);
                //     fiat = histPrices[index][1] * amount;
                // }
                // add to data obj
                dataObj["Rewards"].push({
                    "reward_date": date,
                    "reward_amount": amount,
                    //"fiat_conversion": fiat 
                })
            }
            let finaldata = JSON.parse(JSON.stringify(dataObj));
            response.json(finaldata);
            // })());
        }
    } catch (err) {
        response.status(500).json({ "Message": `Error in retrieving balance, returned message from server: ${err}` })
    }
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse
  ) => {
    const {address} = req.query
    await tezReturnRewards(address as string, res)
}