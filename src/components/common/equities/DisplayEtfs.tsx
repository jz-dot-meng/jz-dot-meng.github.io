//styling
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeEtfFromPortfolio, TickerWeightingPayload } from '../../../redux/equities/actions/etfOverlapActions'
import { ReduxRootState } from '../../../redux/store'
import { DefaultButton } from '../buttons/DefaultButton'
import './DisplayEtfs.css'

type DisplayEtfsProps = {
    isLoading: boolean
}

export const DisplayEtfs: React.FunctionComponent<DisplayEtfsProps> = ({ ...props }) => {
    const { isLoading } = props
    const etfs = useSelector((state: ReduxRootState) => state.equities.etfOverlap.portfolio)

    const [portfolio, setPortfolio] = useState<TickerWeightingPayload>({})

    useEffect(() => {
        setPortfolio(etfs)
    }, [etfs])

    const dispatch = useDispatch()

    const removeEtf = (ticker: string) => {
        dispatch(removeEtfFromPortfolio(ticker))
    }


    return (
        <>
            <div className="displayEtfs-container">
                {isLoading ?
                    <div className="displayEtfs-loadingState">
                        <div className="displayEtfs-spinner"></div>
                    </div>
                    :
                    <></>
                }
                <table className="displayEtfs-table">
                    <thead>
                        <tr>
                            <th>ETF</th>
                            <th>Weighting</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.entries(portfolio).map((tickerWeighting) => (
                                <tr key={tickerWeighting[0]}>
                                    <td>{tickerWeighting[0]}</td>
                                    <td>{tickerWeighting[1]}%</td>
                                    <td>
                                        <DefaultButton
                                            content=' - '
                                            onClick={() => removeEtf(tickerWeighting[0])}
                                        />
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

            </div>
        </>
    )
}