import { TokenBalancePayload } from "../../redux/wallet/actions/addressActions"
import { addTokenConversion } from "../../redux/wallet/actions/currencyActions"
import { store } from "../../redux/wallet/store"

export class BlockchainFactory {
    static chain(blockchain: string) {
        switch (blockchain) {
            case 'Polkadot':
                return new Polkadot()
            case 'Algorand':
                return new Algorand()
            case 'Tezos':
                return new Tezos()
            case 'Stellar':
                return new Stellar()
            case 'Ethereum':
            default:
                return new Ethereum()
        }
    }
}

abstract class BlockchainBalance {
    abstract nativeDecimal: number;
    parseBalance(data: any): TokenBalancePayload {
        const walletTokens: TokenBalancePayload = []
        const assets: any[] = data.Balances;
        assets.forEach(asset => {
            if (asset.Balance !== 0) {
                walletTokens.push({ [asset['Asset_code']]: asset.Balance })
            }
        })
        return walletTokens;
    }
}

export class Polkadot extends BlockchainBalance {
    nativeDecimal: number = 10;

}
export class Ethereum extends BlockchainBalance {
    nativeDecimal: number = 18;

}
export class Algorand extends BlockchainBalance {
    nativeDecimal: number = 6;

}
export class Tezos extends BlockchainBalance {
    nativeDecimal: number = 0;

}
export class Stellar extends BlockchainBalance {
    nativeDecimal: number = 0;
    override parseBalance(data: any): TokenBalancePayload {
        const walletTokens: TokenBalancePayload = []
        const assets: any[] = data.Balances;
        assets.forEach((asset) => {
            if (asset.Balance !== 0) {
                switch (asset['Asset_type']) {
                    case 'liquidity_pool_shares':
                        const pooledAssets = asset['Current_pooled_asset'];
                        pooledAssets.forEach((asset: any) => {
                            this.checkIfConversionExists(asset)
                            walletTokens.push({ [asset['Asset_code']]: asset.Balance });
                        })
                        break;
                    case 'credit_alphanum4':
                        this.checkIfConversionExists(asset)
                        walletTokens.push({ [asset['Asset_code']]: asset.Balance });
                        break;
                    case 'native':
                    default:
                        walletTokens.push({ [asset['Asset_code']]: asset.Balance })
                        break;
                }
            }
        })
        return walletTokens
    }

    /**
     * check if token conversion is already in stored in state, or dispatch to conversion otherwise
     * @param tokenTicker ticker
     * @param state TokenConversionPayload array {fromToken,toToken,conversion}
     */
    private checkIfConversionExists(asset: any) {
        const state = store.getState()
        const conversions = state.crypto.currencyCoversion.tokenConversions
        const conversionFromTickers = conversions.map(conversion => conversion.fromToken);
        const fromToken = asset['Asset_code'];
        const conversionExists: boolean = conversionFromTickers.indexOf(fromToken) !== -1
        if (!conversionExists) {
            const toToken = 'XLM';
            const conversion = asset['Latest_bid_to_xlm']
            store.dispatch(addTokenConversion({ fromToken, toToken, conversion }))
        }
    }
}