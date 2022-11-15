import { NextApiRequest, NextApiResponse } from "next";


const fetchHistoricData = async (token:string, currency:string, start:string, end:string, response:NextApiResponse)=> {
    token = token.toLowerCase();
    // let historic = cacheProvider.instance().get(`${token}_${currency}_historicPrice`)

    try {
        const data = await fetch(`https://api.coingecko.com/api/v3/coins/${token}/market_chart/range?vs_currency=${currency}&from=${start}&to=${end}`)
        const dataResponse = await data.json();
        // todo: strict type all fetch responses
        let priceObj:any = {};
        // console.log(dataResponse)
        dataResponse.prices.forEach((datePriceArr:any) => {
            priceObj[datePriceArr[0]] = datePriceArr[1]
        })
        let dataObj = {
            token: token,
            currency: currency,
            data: priceObj
        }
        response.json(dataObj)
    } catch (e) {
        response.status(500).json({ "Message": `Error in retrieving historic price, returned message from server: ${e}` });
    }
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse
  ) => {
    const {token,currency,start,end} = req.query
    await fetchHistoricData(token as string, currency as string,start as string, end as string, res)
}