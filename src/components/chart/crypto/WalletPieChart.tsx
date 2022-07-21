import { useEffect } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { Doughnut } from "react-chartjs-2"

//types and interfaces
import { ReduxRootState } from "../../../redux/store"

import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem } from 'chart.js';
import { addEllipses } from "../../../utils/wallet/string"

ChartJS.register(ArcElement, Tooltip, Legend);
export const WalletPieChart = () => {
    const walletFiat = useSelector((state: ReduxRootState) => state.crypto.addressTracker.balances.fiat)
    const currency = useSelector((state: ReduxRootState) => state.crypto.currencyCoversion.currency)

    const [labels, setLabels] = useState<string[]>([])
    const [balanceData, setBalanceData] = useState<number[]>()
    const [colorData, setColorData] = useState<string[]>([])
    //const [totalFiatBalance, setTotalFiatBalance] = useState<number>(0)


    /**
     * {
     *  [blockchain]:[
     *      {address:balance},
     *      {address:balance},
     *  ]
     * }
     */
    useEffect(() => {
        const tempLabels: string[] = [];
        const tempBalance: number[] = [];
        const tempColor: string[] = []
        const arraysofArrays = Object.values(walletFiat);
        arraysofArrays.forEach((array, index) => {
            array.forEach(wallet => {
                const addr = Object.keys(wallet)[0]
                wallet[addr].forEach(token => {
                    let tokenTicker = Object.keys(token)[0];
                    tempBalance.push(token[tokenTicker])
                    tempLabels.push(`${addEllipses(addr, true)} (${tokenTicker})`);
                    // generate color
                    const generateRand256 = () => Math.floor(Math.random() * 255)
                    const rgb = `rgba(${generateRand256()},${generateRand256()},${generateRand256()},0.4)`
                    tempColor.push(rgb)
                })
            })
        })
        setLabels(tempLabels);
        setBalanceData(tempBalance);
        setColorData(tempColor);
        // calculateTotalFiat();
    }, [walletFiat])

    // const calculateTotalFiat = () => {
    //     let sum: number = 0;
    //     const blockchainArrayOfArrays = Object.values(walletFiat);
    //     // FIXME: not intuitive
    //     blockchainArrayOfArrays.forEach(chain => {
    //         chain.forEach(address => {
    //             const tokensPerAddr = Object.values(address);
    //             tokensPerAddr.forEach(tokens => {
    //                 tokens.forEach(token => {
    //                     const fiatVal = Object.values(token)[0];
    //                     sum += fiatVal;
    //                 })
    //             })
    //         })
    //     })
    //     setTotalFiatBalance(sum)
    // }

    return (
        <Doughnut
            style={{
                width: '100%',
                height: '100%',
                aspectRatio: 'unset'
            }}
            options={{
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem: TooltipItem<'doughnut'>) {
                                const amount = tooltipItem.raw as number;
                                return `${tooltipItem.label}: ${Intl.NumberFormat('en-AU', { style: 'currency', currency: currency }).format(amount)}`
                            }
                        },
                    },
                },
            }}
            data={{
                labels: labels,
                datasets: [{
                    data: balanceData,
                    backgroundColor: colorData,
                    borderWidth: 1
                }]
            }}
        />
    )
}