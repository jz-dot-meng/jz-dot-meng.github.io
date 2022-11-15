import { NextApiRequest, NextApiResponse } from "next";
import { coinList } from '../../utils/constants/coinlist';


const fetchCurrentPrice = async (token: string, currency: string, response: NextApiResponse)=> {
    token = token.toLowerCase();
    // let price = cacheProvider.instance()?.get(`${token}_${currency}_price`)

    try {
        // if (price === undefined || price === null) {
            // console.time('search_coinlist')
            const tokenDetail:{id:string,symbol:string,name:string}[] = coinList.filter(item => item.symbol === token.toLowerCase())
            // console.timeEnd('search_coinlist')
            // console.log({ token, tokenDetail });
            if (tokenDetail.length === 0) {
                response.status(500).json({ 'Message': 'Token not tracked by coingecko' })
                return;
            }
            const tokenName = tokenDetail[0].name
            const data = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenName}&vs_currencies=${currency}
            `)
            const resp = await data.json();
            const price = resp[tokenName.toLowerCase()][currency];
            // set 6hr ttl
            const sixhourttl = 6 * 60 * 60
            // cacheProvider.instance()?.set(`${token}_${currency}_price`, price, sixhourttl)
        // }
        response.json({
            [`${token}`]: {
                [`${currency}`]: price
            }
        })
    } catch (e) {
        response.status(500).json({ "Message": `Error in retrieving price, returned message from server: ${e}` });
    }
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse
  ) => {
    const {token,currency} = req.query
    await fetchCurrentPrice(token as string, currency as string, res)
}