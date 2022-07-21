import { setWalletBalance, setWalletFiatBalance, TokenBalancePayload, WalletTokenPayload } from "../../redux/wallet/actions/addressActions";
import { addCurrentPrice } from "../../redux/wallet/actions/tokenPriceActions";
import { store } from "../../redux/store"
import { BlockchainFactory } from "../blockchain/blockchainFactory"

/**
 * Series of actions to take given a valid address + wallet balance returned from API
 * @param blockchain 
 * @param address 
 * @param data 
 */
export const fetchAndSetAllWalletData = (blockchain: string, address: string, data: any) => {
    console.log(`setting balance for ${address}...`)
    const tokenBalance = setBalance(blockchain, address, data);
    console.log(`fetching fiat balance for ${address}...`)
    fetchFiatBalance(blockchain, address, tokenBalance)
}

/**
 * From the data returned from in-house wallet balance API, calculate correct token decimal and set wallet balance
 * @param blockchain 
 * @param address
 * @param data 
 * @returns token balance of the wallet 
 */
export const setBalance = (blockchain: string, address: string, data: any): TokenBalancePayload => {
    const chain = BlockchainFactory.chain(blockchain);
    const tokenBalance = chain.parseBalance(data)
    const walletTokens: WalletTokenPayload = [{ [address]: tokenBalance }]
    store.dispatch(setWalletBalance({ blockchain, walletTokens }))
    return tokenBalance;
}


export const fetchFiatBalance = async (blockchain: string, address: string, tokenBalance: TokenBalancePayload) => {
    const tokenPrices = tokenBalance.map((item: { [token: string]: number }): Promise<{ [token: string]: number }> => {
        return new Promise((resolve, reject) => {
            // console.log('token item', item)
            let tokenTicker = Object.keys(item)[0];
            // check if ticker exists in tokenConversion
            const conversionToken = checkIfConversionExists(tokenTicker)
            if (conversionToken === undefined) {
                fetchFiatToken(tokenTicker).then((price: number) => {
                    const state = store.getState();
                    const currency = state.crypto.currencyCoversion.currency;
                    store.dispatch(addCurrentPrice({ tokenName: blockchain, currency, data: { [tokenTicker]: price } }))
                    const fiatValueOfTokens = price * item[Object.keys(item)[0]]
                    // console.log('fiat value', fiatValueOfTokens)
                    resolve({ [tokenTicker]: fiatValueOfTokens })
                }).catch(err => {
                    resolve({ [tokenTicker]: NaN })
                })
            } else {
                fetchFiatToken(conversionToken.toToken).then((price: number) => {
                    const fiatValueOfTokens = price * item[Object.keys(item)[0]] * conversionToken.conversion;
                    // console.log('fiat value', fiatValueOfTokens)
                    resolve({ [tokenTicker]: fiatValueOfTokens })
                }).catch(err => {
                    resolve({ [tokenTicker]: NaN })
                })
            }
        })
    })
    Promise.all(tokenPrices).then((fiatTokenPrices: TokenBalancePayload) => {
        const walletFiat: WalletTokenPayload = [{ [address]: fiatTokenPrices }]
        // console.log('walletFiat', walletFiat)
        store.dispatch(setWalletFiatBalance({ blockchain, walletFiat }))
    })
}

const checkIfConversionExists = (tokenTicker: string) => {
    const state = store.getState()
    const conversions = state.crypto.currencyCoversion.tokenConversions
    const conversionFromTickers = conversions.filter(conversion => conversion.fromToken === tokenTicker);
    if (conversionFromTickers.length === 0) {
        return undefined
    }
    else return conversionFromTickers[0]
}

export const fetchFiatToken = async (token: string): Promise<number> => {
    const state = store.getState();
    const currency = state.crypto.currencyCoversion.currency;
    return new Promise(async (resolve, reject) => {
        const url = `${process.env.REACT_APP_WALLET_API}/price&token=${token}&currency=${currency}`
        try {
            let price: number = NaN;
            const resp = await fetch(url, {
                method: 'GET'
            })
            if (resp.ok) {
                const data = await resp.json();
                price = data[token.toLowerCase()][currency];
                // console.log('token fiat price fetch ok', { data, price })
                resolve(price);
            } else {
                const err = await resp.json()
                console.warn('Price fetch not successful', err)
                reject(price)
            }
        } catch (err) {
            console.warn('Error fetching price', err)
            reject(NaN)
        }
    })
}