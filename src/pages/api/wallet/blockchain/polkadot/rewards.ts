import { NextApiRequest, NextApiResponse } from "next";
import { timeout } from "pages/api/utils/constants/datetime-utils";


const dotReturnRewards = async (ADDR:string, response:NextApiResponse) =>{
    try {
        // console.log('fetching polkadot rewards')
        const url = "https://polkadot.api.subscan.io/api/scan/account/reward_slash";
        // GET request body
        let getBody = {
            "row": 50, // arbitrary max 50 items per page?
            "page": 0,
            "address": ADDR
        };
        // GET request full options
        let options:RequestInit = {
            'method': "POST",
            'body': JSON.stringify(getBody),
            'headers': {
                'Content-Type': 'application/json',
                'X-API-Key': process.env.NEXT_PUBLIC_SUBSCAN_API_KEY as string
            }
        };

        // eventually return this as json
        let dataObj: {Message:string,Address:string,Rewards:any[]} = { "Message": "Successfully connected to the Subscan API and returned all staking rewards", "Address": ADDR, "Rewards": [] };
        let data;
        let isFinished = false;
        let tempArr:any[] = [];
        while (isFinished == false) {
            // console.log(`page ${getBody['page']} of dot rewards`, options)
            await timeout(200);
            await fetch(url, options)
                .then(res => res.json())
                .then(res => (function () {
                    if (res.message === 'API rate limit exceeded') {
                        console.log('API limit exceeded?', res)
                        throw 'API rate limit exceeded'
                    }
                    if(res.code === 400){
                        throw new Error(res.message)
                    }
                    if (res.data?.list != null) {
                        tempArr.push(...res.data.list)
                        getBody["page"]++;
                        options.body = JSON.stringify(getBody);
                    } else {
                        isFinished = true;
                    }
                })())
        }
        if (tempArr.length == 0) {
            data = JSON.parse(JSON.stringify(dataObj));
            response.json(data);
        } else {
            console.log(tempArr.length)
            // // find start/end dates for coingecko api call, in unix timestamp format
            // let end = Date.now();
            // // need to force 90 days from end query time to get daily data granularity, 90days=7776000seconds
            // let start;
            // if (tempArr[0]['block_timestamp'] - tempArr[(tempArr.length - 1)]['block_timestamp'] < 7776000) {
            //     start = tempArr[0]['block_timestamp'] - 7777000; // add extra just to ensure it will return correctly
            // } else {
            //     start = (60 * 60 * 24) * Math.floor(tempArr[(tempArr.length - 1)]['block_timestamp'] / (60 * 60 * 24));
            // }
            // let histPrices = [];
            // let currentPrice = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=" + currency.toLowerCase()) // should the validation occur here, or in the clientside program?
            //     .then(res => res.json())
            //     .then(res => (function () {
            //         return res['polkadot']['aud'];
            //     })());
            // await fetch('https://api.coingecko.com/api/v3/coins/polkadot/market_chart/range?vs_currency=' + currency.toLowerCase() + "&from=" + start + "&to=" + end)
            //     .then(res => res.json())
            //     .then(resp => (function () {
            //         histPrices = resp["prices"];
            //         // convert date data from millisecond_unix to datestring, from the coingecko response
            //         histPrices.forEach(item => item[0] = new Date(item[0]).toDateString())
            //         let currentDate = new Date().toDateString(); // coingecko historic data doesn't return current day
            for (let i = tempArr.length - 1; i >= 0; i--) {
                // convert unix to milliseconds for date formatting, necessary to do so?
                let date = new Date((tempArr[i]['block_timestamp'] * 1000)).toDateString();
                let amount = tempArr[i]['amount'] / Math.pow(10, 10);
                // let fiat;
                // if (date == currentDate) {
                //     fiat = currentPrice * amount;
                // } else {
                //     let index = binaryDateSearch(date, histPrices, 0)
                //     fiat = histPrices[index][1] * amount;
                // }
                // add to data obj
                dataObj["Rewards"].push({
                    "reward_date": date,
                    "reward_amount": amount,
                    // "fiat_conversion": fiat 
                })
            }
            data = JSON.parse(JSON.stringify(dataObj));
            response.json(data);
            // })());
        }
    } catch (e) {
        response.status(500).json({ "Message": `Error in retrieving rewards, returned error message: ${e}` })
    }
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse
  ) => {
    const {address} = req.query
    await dotReturnRewards(address as string, res)
}