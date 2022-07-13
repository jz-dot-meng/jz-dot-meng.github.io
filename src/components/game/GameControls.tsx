import { useCallback, useEffect, useState } from "react"
import { GameButton } from "../common/buttons/GameButton"
import { GameStates } from "./GameTemplate"

//styling
import './Game.css'


type GameControlsProps = {
    state: keyof typeof GameStates
    controls: {
        [GameStates.Initial]?: any[],
        [GameStates.PlayGame]?: any[],
        [GameStates.GameOver]?: any[],
        bindLeftArrow?: () => void;
        bindRightArrow?: () => void;
        bindUpArrow?: () => void;
        bindDownArrow?: () => void;
    },
}

export const GameControls: React.FunctionComponent<GameControlsProps> = ({ ...props }) => {
    const { state, controls } = props

    const [controlArray, setControlArray] = useState<any[] | undefined>([])

    useEffect(() => {
        // console.log('state change for game control')
        switch (state) {
            case 'Initial':
                setControlArray(controls.Initial);
                break;
            case 'PlayGame':
                setControlArray(controls.PlayGame);
                window.addEventListener('keyup', bindArrowKeys, true)
                break;
            case 'GameOver':
                setControlArray(controls.GameOver);
                window.removeEventListener('keyup', bindArrowKeys, true)
                break;
        }
    }, [state])

    const bindArrowKeys = useCallback((e: KeyboardEvent) => {
        switch (e.code) {
            case 'ArrowLeft':
                if (controls.bindLeftArrow !== undefined) {
                    controls.bindLeftArrow();
                    // console.log('arrow left', controls.bindLeftArrow)
                }
                break;
            case 'ArrowRight':
                if (controls.bindRightArrow !== undefined) {
                    controls.bindRightArrow();
                    // console.log('arrow right', controls.bindRightArrow)
                }
                break;
            case 'ArrowUp':
                if (controls.bindUpArrow !== undefined) {
                    controls.bindUpArrow();
                    console.log('arrow up')
                }
                break;
            case 'ArrowDown':
                if (controls.bindDownArrow !== undefined) {
                    controls.bindDownArrow();
                }
                break;
            default:
                break;
        }
    }, [])


    return (
        <>
            <div className="game-flex">
                {
                    controlArray?.map((control, index) => (
                        <GameButton key={index} onClick={(control.onClick)} buttonText={control.buttonText} />
                    ))
                }
            </div>
        </>
    )
}