
export const getRewardTickerFromBlockchain = (blockchain: string) => {
    switch (blockchain) {
        case 'Tezos':
            return 'XTZ';
        case 'Algorand':
            return 'ALGO';
        case 'Stellar':
            return 'yXLM';
        case 'Polkadot':
            return 'DOT';
        default:
            return ''
    }
}