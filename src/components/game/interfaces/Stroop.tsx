//styling
import { useEffect } from 'react'
import { GameCard } from '../../common/game/GameCard'
import { GameStates } from '../GameTemplate'
import './Stroop.css'

type StroopType = {
    state: keyof typeof GameStates
    card1: {
        cardType: string,
        cardWord: string
        wordStyle: any
    } | undefined,
    card2: {
        cardType: string,
        cardWord: string
        wordStyle: any
    } | undefined
}

export const Stroop: React.FunctionComponent<StroopType> = ({ ...props }) => {
    const { state, card1, card2 } = props

    return (
        <>
            <div style={{ visibility: state === 'PlayGame' ? 'visible' : 'hidden' }} className='stroop-cardContainer'>
                <GameCard cardTitle={card1?.cardWord} cardSubTitle={card1?.cardType} cardTitleStyle={card1?.wordStyle} />
                <GameCard cardTitle={card2?.cardWord} cardSubTitle={card2?.cardType} cardTitleStyle={card2?.wordStyle} />
            </div>
        </>
    )
}