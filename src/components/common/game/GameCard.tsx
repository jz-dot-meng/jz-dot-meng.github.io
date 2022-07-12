
//styling
import './GameCard.css'

type GameCardProps = {
    cardTitle?: string;
    cardTitleStyle?: any;
    cardSubTitle?: string;
    cardSubTitleStyle?: any;
}

export const GameCard: React.FunctionComponent<GameCardProps> = ({ ...props }) => {
    const { cardTitle, cardTitleStyle, cardSubTitle, cardSubTitleStyle } = props
    return (
        <>
            <div className='gamecard'>
                <div className='subtitle' style={cardSubTitleStyle}>{cardSubTitle}</div>
                <div className='title' style={cardTitleStyle}>{cardTitle}</div>
            </div>
        </>
    )
}