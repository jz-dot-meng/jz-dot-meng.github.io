import { Chart as ChartJS, ArcElement, Legend, Tooltip, TooltipItem } from "chart.js"
import { useEffect, useState } from "react"
import { Doughnut } from "react-chartjs-2"
import { useSelector } from "react-redux"
import { ReduxRootState } from "../../../redux/store"

type BreakdownPieChartProps = {
    breakdown: string
}

ChartJS.register(ArcElement, Tooltip, Legend)
export const BreakdownPieChart: React.FunctionComponent<BreakdownPieChartProps> = ({ ...props }) => {
    const { breakdown } = props

    const portfolio = useSelector((state: ReduxRootState) => state.equities.etfOverlap.portfolio);
    const holdings = useSelector((state: ReduxRootState) => state.equities.etfOverlap.etfHoldings)

    const [labelWeighting, setLabelWeighting] = useState<{ [label: string]: number }>({})
    const [colorData, setColorData] = useState<string[]>([])

    useEffect(() => {
        let sumOfWeightings: number = 0; // may not be 100%;
        const etfs = Object.keys(portfolio)
        etfs.forEach(etf => {
            sumOfWeightings += portfolio[etf]
        })

        // to assign to state
        let weightings: { [label: string]: number } = {}
        // color generation
        let tempColor: string[] = []
        const generateRand256 = () => Math.floor(Math.random() * 255)
        // iterate through each etfs holding
        etfs.forEach(etf => {
            holdings[etf].forEach(stock => {
                let relativeWeight = Number(stock.weight) * (portfolio[etf] / sumOfWeightings)
                let key: string = breakdown.split(' ')[0].toLowerCase();
                //@ts-ignore - will be either country or sector
                let breakdownValue = stock[key]
                if (breakdownValue === '' || breakdownValue === undefined) {
                    breakdownValue = 'Other'
                }
                if (weightings[(breakdownValue)] === undefined) {
                    weightings[(breakdownValue)] = relativeWeight * 100
                    const rgb = `rgba(${generateRand256()},${generateRand256()},${generateRand256()},0.4)`
                    tempColor.push(rgb)
                } else {
                    weightings[(breakdownValue)] += relativeWeight * 100
                }
            })
        })
        setLabelWeighting(weightings)
        setColorData(tempColor)
    }, [holdings, breakdown])

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
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem: TooltipItem<'doughnut'>) {
                                const amount = tooltipItem.raw as number;
                                return `${tooltipItem.label}: ${amount.toFixed(3)}%`
                            }
                        },
                    },
                }
            }}
            data={{
                labels: Object.keys(labelWeighting),
                datasets: [{
                    data: Object.values(labelWeighting),
                    backgroundColor: colorData,
                    borderWidth: 1
                }]
            }}
        />
    )
}