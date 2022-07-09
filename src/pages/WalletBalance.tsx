
//styling
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { WalletPieChart } from '../components/chart/crypto/WalletPieChart'
import { AddWalletAddress } from '../components/common/crypto/AddWalletAddress'
import { DisplayAddresses } from '../components/common/crypto/DisplayAddresses'
import { StakingRewards } from '../components/common/crypto/StakingRewards'
import '../index.css'
import { ReduxRootState } from '../redux/wallet/store'
import './WalletBalance.css'


function WalletBalance() {

    const fiatBalanceArr = useSelector((state: ReduxRootState) => state.crypto.addressTracker.balances.fiat)
    const currency = useSelector((state: ReduxRootState) => state.crypto.currencyCoversion.currency)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [totalFiatBalance, setTotalFiatBalance] = useState<number>(0)

    useEffect(() => {
        let sum: number = 0;
        const blockchainArrayOfArrays = Object.values(fiatBalanceArr);
        // FIXME: not intuitive
        blockchainArrayOfArrays.forEach(chain => {
            chain.forEach(address => {
                const tokensPerAddr = Object.values(address);
                tokensPerAddr.forEach(tokens => {
                    tokens.forEach(token => {
                        const fiatVal = Object.values(token)[0];
                        sum += fiatVal;
                    })
                })
            })
        })
        setTotalFiatBalance(sum)
    }, [fiatBalanceArr])

    const chains = [
        // 'Ethereum',
        'Polkadot',
        'Tezos',
        'Algorand',
        'Stellar'
    ]

    const toggleIsLoading = (state: boolean) => {
        setIsLoading(state)
    }

    return (
        <>
            <div className='balance-header'>
                <h1>Wallet Balance<span> :: a one-stop shop for various blockchains</span></h1>
            </div>
            <div className='balance-body'>
                <div className='balance-body-upper'>
                    <section className='upper-left'>
                        <h4>Wallet Addresses</h4>
                        <AddWalletAddress blockchains={chains} toggleIsLoading={toggleIsLoading} />
                        <DisplayAddresses isLoading={isLoading} />
                    </section>
                    <section className='upper-right'>
                        <h4>Total Balance {
                            totalFiatBalance > 0 ?
                                `:: ${Intl.NumberFormat('en-AU', { style: 'currency', currency: currency }).format(totalFiatBalance)}`
                                : ''
                        }
                        </h4>
                        <div>
                            <WalletPieChart />
                        </div>
                    </section>
                </div>
                <div className='balance-body-lower'>
                    <section>
                        <h4>Staking rewards</h4>
                        <StakingRewards />
                    </section>
                </div>
            </div>
        </>
    )
}

export default WalletBalance