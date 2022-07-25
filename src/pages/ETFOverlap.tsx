import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BreakdownPieChart } from '../components/chart/equities/BreakdownPieChart'
import { AddEtfs } from '../components/common/equities/AddEtfs'
import { DisplayEtfs } from '../components/common/equities/DisplayEtfs'
import { PortfolioOverlap } from '../components/common/equities/PortfolioOverlap'
import { LeftRightSelect } from '../components/common/selections/LeftRightSelect'
//styling
import './Global.css'

export const ETFOverlap = ({ ...props }) => {

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const toggleIsLoading = (state: boolean) => {
        setIsLoading(state)
    }

    const etfs = {
        'betashares': {
            // 'DZZF': 'Ethical Diversified High Growth ETF',
            // 'DGGF': 'Ethical Diversified Growth ETF',
            // 'DBBF': 'Ethical Diversified Balanced ETF',
            'ETHI': 'Global Sustainability Leaders ETF',
            'FAIR': 'Australian Sustainability Leaders ETF',
            'TANN': 'Solar ETF',
            'IEAT': 'Future of Food ETF',
            'DRIV': 'Electric Vehicles and Future Mobility ETF',
            'ERTH': 'Climate Change Innovation ETF',
            'CRYP': 'Crypto Innovators ETF',
            'URNM': 'Global Uranium ETF'
        }
    }

    const [breakdownIndex, setBreakdownIndex] = useState<number>(0)

    const breakdowns: string[] = ['Sector Weightings', 'Country Weightings'];

    const changeBreakdownHandler = (newIndex: number) => {
        setBreakdownIndex(newIndex)
    }

    return (
        <>
            <div className='etf-header'>
                <h4><Link to='/'>@jz-dot-meng</Link></h4>
                <h1>ETF overlap<span> :: build a thematic ETF portfolio and see the fund overlaps</span></h1>
            </div>
            <div className='etf-body'>
                <div className='etf-body-upper'>
                    <section className='upper-left'>
                        <h4>ETF Portfolio</h4>
                        <AddEtfs etfs={etfs} toggleIsLoading={toggleIsLoading} />
                        <DisplayEtfs isLoading={isLoading} />
                    </section>
                    <section className='upper-right'>
                        <LeftRightSelect options={breakdowns} selection={breakdownIndex} onChange={changeBreakdownHandler} style={{ color: 'black', display: 'flex', padding: '1.5em 0', fontWeight: 'bold' }} />
                        <div>
                            <BreakdownPieChart breakdown={breakdowns[breakdownIndex]} />
                        </div>
                    </section>
                </div>
                <div className='etf-body-lower'>
                    <h4>Holding overlaps</h4>
                    <div>
                        <PortfolioOverlap />
                    </div>
                </div>
            </div>
            <div className='etf-footer'>
                This tool is not intended as financial advice, simply as an aid to personal research. Support for Vanguard ETFs coming soon!
            </div>
        </>
    )
}