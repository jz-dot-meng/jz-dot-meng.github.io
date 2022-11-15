import { NextApiRequest, NextApiResponse } from "next";
import { YXLM_PAYMENT } from "pages/api/utils/constants";
import stellar from 'stellar-sdk';


const xlmReturnRewards = async (ADDR:string, response:NextApiResponse)=> {
    try {
        const server = new stellar.Server("https://horizon.stellar.org");

        const dataObj:{Message:string,Address:string,Rewards:any[]} = { "Message": "Successfully opened a Stellar connection and retrieved payment rewards from yXLM", 'Address': ADDR, 'Rewards': [] };

        const tempArr:any[] = [];
        server.payments().forAccount(ADDR).limit(200).call().then(async (resp:any) => {
            let pages = resp;
            while (pages.records.length > 0) {
                const records = pages.records;
                // console.log(records)
                for (let i = 0; i < records.length; i++) {
                    if (records[i]?.from === YXLM_PAYMENT) {
                        // const item = {
                        //     'reward_date': new Date(records[i]['created_at']).toDateString(),
                        //     'reward_amount': records[i]['amount']
                        // }
                        // dataObj.Rewards.push(item);
                        tempArr.push(records[i]);
                    }
                }
                pages = await pages.next();
            }
            if (tempArr.length == 0) {
                let data = JSON.parse(JSON.stringify(dataObj));
                response.json(data);
            } else {
                // find start/end dates for coingecko api call, in unix timestamp format
                // let end = Date.now();
                // let firstRecord = new Date(tempArr[0]['created_at']).getTime() / 1000
                // let start;
                // if (end - firstRecord < 7776000) {
                //     start = end - 7777000; // add extra just to ensure it will return correctly
                // } else {
                //     start = (60 * 60 * 24) * Math.floor(firstRecord / (60 * 60 * 24));
                // }
                // let histPrices = [];
                // let currentPrice = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=" + currency.toLowerCase()) // should the validation occur here, or in the clientside program?
                //     .then(res => res.json())
                //     .then(res => (function () {
                //         return res['stellar']['aud'];
                //     })());
                // await fetch('https://api.coingecko.com/api/v3/coins/stellar/market_chart/range?vs_currency=' + currency.toLowerCase() + "&from=" + start + "&to=" + end)
                //     .then(res => res.json())
                //     .then(resp => (function () {
                //         histPrices = resp["prices"];
                //         // convert date data from millisecond_unix to datestring, from the coingecko response
                //         histPrices.forEach(item => item[0] = new Date(item[0]).toDateString())
                //         let currentDate = new Date().toDateString(); // coingecko historic data doesn't return current day
                for (let i = 0; i < tempArr.length; i++) {
                    // convert unix to milliseconds for date formatting, necessary to do so?
                    let date = new Date(tempArr[i]['created_at']).toDateString();
                    let amount = tempArr[i]['amount'];
                    // let fiat;
                    // if (date == currentDate) {
                    //     fiat = currentPrice * amount;
                    // } else {
                    //     // binary search instead of loop?
                    //     let index = binaryDateSearch(date, histPrices, 0);
                    //     fiat = histPrices[index][1] * amount;
                    // }
                    // check if same date as previous push
                    if (i > 1) {
                        let dataObjLastAdded = dataObj['Rewards'].length - 1;
                        // console.log('current iteration:', date, 'last dataObj entry:', dataObj['Rewards'][dataObjLastAdded]['reward_date'])
                        if (date !== dataObj['Rewards'][dataObjLastAdded]['reward_date']) {
                            // add to data obj
                            // console.log('new entry')
                            dataObj["Rewards"].push({
                                "reward_date": date,
                                "reward_amount": amount,
                                // "fiat_conversion": fiat 
                            })
                        } else {
                            // updating existing entry
                            dataObj['Rewards'][dataObjLastAdded]['reward_amount'] = Number(dataObj['Rewards'][dataObjLastAdded]['reward_amount']) + Number(amount);
                            // dataObj['Rewards'][dataObjLastAdded]['fiat_conversion'] = Number(dataObj['Rewards'][dataObjLastAdded]['fiat_conversion']) + Number(fiat);
                            // console.log('updated entry', dataObj['Rewards'][dataObjLastAdded])
                        }
                    } else {
                        dataObj["Rewards"].push({
                            "reward_date": date,
                            "reward_amount": amount,
                            //  "fiat_conversion": fiat
                        })
                    }
                }
                let finaldata = JSON.parse(JSON.stringify(dataObj));
                response.json(finaldata);
                // })());
            }
        })

    } catch (err) {
        response.status(500).json({ "Message": `Error in retrieving rewards, returned message from server: ${err}` })
    }
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse
  ) => {
    const {address} = req.query
    await xlmReturnRewards(address as string, res)
}