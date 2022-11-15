import { NextApiRequest, NextApiResponse } from "next"

const fetchHoldings = async (ticker: string, res:NextApiResponse) => {
    return new Promise(async (resolve, reject) => {
        fetch(`https://www.betashares.com.au/files/csv/${ticker}_Portfolio_Holdings.csv`)
            .then(async resp => {
                const text = await resp.text()
                const delineateLines = text.split(/\r?\n/)
                const stripHeadersFooters = delineateLines.slice(7, delineateLines.length - 5) // remove the betashares headers
                // console.log(delineateLines)
                const mapped = stripHeadersFooters.map(line => {
                    const dataArray = line.split(',');
                    return {
                        ticker: dataArray[0],
                        sedol: dataArray[1],
                        name: dataArray[2],
                        assetClass: dataArray[3],
                        sector: dataArray[4],
                        country: dataArray[5],
                        currency: dataArray[6],
                        weight: dataArray[7],
                        units: dataArray[8],
                        marketValAud: dataArray[9],
                        notionalValAud: dataArray[10]
                    }
                })
                res.status(200).json({ [ticker]: mapped })
            })
            .catch(err => {
                console.warn(err)
                res.status(501).send(JSON.stringify(err))
            })
    })
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const {ticker} = req.query
    await fetchHoldings(ticker as string, res);
}