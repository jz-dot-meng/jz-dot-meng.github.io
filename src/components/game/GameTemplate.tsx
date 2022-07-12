import { ReactNode, useEffect } from "react"
import { GameControls } from "./GameControls"
import { GameDetailsTracker } from "./GameDetailsTracker"

//styling
import './Game.css'

export enum GameStates {
    'Initial' = 'Initial',
    'PlayGame' = 'PlayGame',
    'GameOver' = 'GameOver'
}

type GameTemplateProps = {
    state: keyof typeof GameStates
    children: ReactNode
    config: {
        gameDetails: {
            [GameStates.Initial]?: any[],
            [GameStates.PlayGame]?: any[],
            [GameStates.GameOver]?: any[],
        },
        gameControls: {
            [GameStates.Initial]?: any[],
            [GameStates.PlayGame]?: any[],
            [GameStates.GameOver]?: any[],
            bindLeftArrow?: () => void;
            bindRightArrow?: () => void;
            bindUpArrow?: () => void;
            bindDownArrow?: () => void;
        }
    }
}

export const GameTemplate: React.FunctionComponent<GameTemplateProps> = ({ ...props }) => {
    const { children, config, state } = props
    useEffect(() => {
        // console.log(config.gameDetails.PlayGame)
    }, [config.gameDetails])

    return (
        <>
            <div className='game-container'>
                <div>
                    <GameDetailsTracker state={state} details={config.gameDetails} />
                </div>
                <div>
                    {children}
                </div>
                <div>
                    <GameControls state={state} controls={config.gameControls} />
                </div>
            </div>
        </>
    )
}