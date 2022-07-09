import { useEffect, useState } from 'react'
import { Chart } from 'react-chartjs-2'

import {
    Chart as ChartJS, LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    TooltipItem,
} from 'chart.js';
import { useSelector } from 'react-redux';
import { ReduxRootState } from '../../../redux/wallet/store';


type WalletGraphType = {
    blockchain: string;
    rewards: { 'reward_date': string, 'reward_amount': number }[]
}

ChartJS.register(LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip
);
export const WalletGraph: React.FunctionComponent<WalletGraphType> = ({ ...props }) => {
    const { blockchain, rewards } = props

    const currency = useSelector((state: ReduxRootState) => state.crypto.currencyCoversion.currency)
    const tokenPrice = useSelector((state: ReduxRootState) => state.crypto.tokenPrice)

    const [labels, setLabels] = useState<string[]>([])
    const [rewardData, setRewardData] = useState<number[]>([])
    const [historicCumulative, setHistoricCumlative] = useState<number[]>([])

    const [ticker, setTicker] = useState<string>('')

    useEffect(() => {
        const tempLabels: string[] = [];
        const tempRewards: number[] = [];
        if (rewards && rewards.length > 0) {
            rewards.forEach(reward => {
                tempLabels.push(reward['reward_date'])
                tempRewards.push(reward['reward_amount'])
            })
        }
        setLabels(tempLabels);
        setRewardData(tempRewards);
        // generate historic data array
        let tokenSum: number = 0
        const tempCumulative: number[] = []

        let currentPriceData = tokenPrice.current[blockchain].data;
        setTicker(Object.keys(currentPriceData)[0])
        let currentPrice = Number(Object.values(currentPriceData)[0])
        for (let i = 0; i < tempRewards.length; i++) {
            tokenSum += Number(tempRewards[i]);
            let fiat = currentPrice * tokenSum;
            tempCumulative.push(fiat);
        }
        setHistoricCumlative(tempCumulative)
    }, [rewards])

    const generateRand256 = () => Math.floor(Math.random() * 255)

    return (
        <>
            <Chart
                type='bar'
                data={{
                    labels: labels, // dates
                    datasets: [
                        {
                            data: rewardData,
                            type: 'bar' as const,
                            label: `Rewards (in ${ticker})`,
                            backgroundColor: `rgba(${generateRand256()},${generateRand256()},${generateRand256()},0.5)`,
                            yAxisID: 'yLeft'
                        },
                        {
                            data: historicCumulative,
                            type: 'line' as const,
                            label: `Cumulative rewards based on latest fiat price`,
                            backgroundColor: `rgba(${generateRand256()},${generateRand256()},${generateRand256()},0.5)`,
                            yAxisID: 'yRight'
                        }
                    ]
                }}
                options={{
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem: TooltipItem<'bar' | 'line'>) {
                                    switch (tooltipItem.datasetIndex) {
                                        case 0:
                                            return `Rewards (in ${ticker}): ${tooltipItem.raw}`
                                        case 1:
                                            const amount = tooltipItem.raw as number;
                                            return `Cumulative rewards in fiat: ${Intl.NumberFormat('en-AU', { style: 'currency', currency: currency }).format(amount)}`
                                    }
                                    return ''
                                }
                            }
                        }
                    },
                    scales: {
                        yLeft: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                        },
                        yRight: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            ticks: {
                                callback: function (value, index, values) {
                                    return value.toLocaleString("en-US", { style: "currency", currency: currency.toUpperCase() })
                                }
                            }
                        }
                    }
                }}
            />
        </>
    )
}