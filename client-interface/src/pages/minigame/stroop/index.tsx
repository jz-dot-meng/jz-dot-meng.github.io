import { GameStates, GameTemplate } from "@components/game/GameTemplate";
import { Stroop } from "@components/game/interfaces/Stroop";
import { useObservableState } from "@utils/hooks/rxjs-hooks";
import { GameDisplay } from "@utils/types/minigame";
import React, { useEffect, useRef, useState } from "react";
import { BehaviorSubject, Subscription, takeWhile, timer } from "rxjs";

enum Choice {
    "match" = "match",
    "noMatch" = "noMatch",
    "reset" = "reset",
}

const COLOUR_LIST = [
    { word: "red", rgba: "rgba(255,0,0,0.9)" },
    { word: "blue", rgba: "rgba(0,0,255,0.9)" },
    { word: "green", rgba: "rgba(0,255,0,0.8)" },
    { word: "cyan", rgba: "rgba(0,255,255,0.8)" },
    { word: "purple", rgba: "rgba(204,0,255,1)" },
    { word: "yellow", rgba: "rgba(245,245,0,0.9)" },
    { word: "orange", rgba: "rgba(255,153,51,0.9)" },
];

const StroopEffect: React.FunctionComponent = () => {
    const [gameState, setGameState] = useState<keyof typeof GameStates>("Initial");

    const time = useRef<BehaviorSubject<number>>(new BehaviorSubject<number>(0));
    const timeDisplay = useObservableState<number>(time.current, 0);
    const [sub, setSub] = useState<Subscription>();
    const [score, setScore] = useState<number>(0);

    const [card1, setCard1] = useState<any>(undefined);
    const [card2, setCard2] = useState<any>(undefined);

    const [meaningWordIndex, setMeaningWordIndex] = useState<number>(0);

    const [colourStyleIndex, setColourStyleIndex] = useState<number>(0);

    const nextCard = () => {
        // skew to roughly half match, half no match
        const prob = Math.random();
        const mwi = Math.floor(Math.random() * (COLOUR_LIST.length - 0.1)); // temp variable to be able to quickly set to two states
        setMeaningWordIndex(mwi);
        // let colourStyleIndex
        let csi;
        if (prob < 0.4) {
            csi = mwi;
            setColourStyleIndex(mwi); // meaning matches colour
        } else {
            csi = Math.floor(Math.random() * (COLOUR_LIST.length - 0.1));
            setColourStyleIndex(csi);
        }
        const cwi = Math.floor(Math.random() * (COLOUR_LIST.length - 0.1));
        // figure out which card to generate meaning/colour
        const leftright = Math.random();
        if (leftright < 0.5) {
            setCard1({
                cardWord: COLOUR_LIST[mwi].word,
                cardType: "meaning",
                wordStyle: {
                    color: "#ffffff",
                },
            });
            setCard2({
                cardWord: COLOUR_LIST[cwi].word,
                cardType: "colour",
                wordStyle: {
                    color: COLOUR_LIST[csi].rgba,
                },
            });
        } else {
            setCard1({
                cardWord: COLOUR_LIST[cwi].word,
                cardType: "colour",
                wordStyle: {
                    color: COLOUR_LIST[csi].rgba,
                },
            });
            setCard2({
                cardWord: COLOUR_LIST[mwi].word,
                cardType: "meaning",
                cardStyle: {
                    color: "#ffffff",
                },
            });
        }
    };

    const startGame = () => {
        // console.log('startgame')
        time.current.next(45);
        setScore(0);
        nextCard();
        setGameState("PlayGame");
    };

    useEffect(() => {
        switch (gameState) {
            case "GameOver": {
                sub?.unsubscribe();
                break;
            }
            case "PlayGame": {
                const s1 = timer(0, 100)
                    .pipe(takeWhile(() => time.current.getValue() > 0))
                    .subscribe((count) => {
                        const newTime = 45 - count * 0.1;
                        time.current.next(newTime);
                    });
                s1.add(() => setGameState("GameOver"));
                setSub(s1);
                break;
            }
        }
    }, [gameState]);

    const gameOver = () => {
        // console.log('gameover')
        time.current.next(0);
        setGameState("GameOver");
        setChoice("reset");
    };

    // useEffect(() => {
    // console.log('setting data', { meaningWord: colourlist[meaningWordIndex].word, colourWord: colourlist[colourWordIndex].word, colourStyle: colourlist[colourStyleIndex].rgba })
    // }, [meaningWordIndex, colourStyleIndex, colourWordIndex, card1, card2, time]);

    const [choice, setChoice] = useState<keyof typeof Choice>("reset");

    useEffect(() => {
        // console.log('validating');
        switch (choice) {
            case "match":
                // console.log('match', { meaningWord: colourlist[meaningWordIndex].word, meaningWordIndex, colourStyle: colourlist[colourStyleIndex].rgba, colourStyleIndex })
                if (meaningWordIndex === colourStyleIndex) {
                    setScore((score) => score + 1);
                    nextCard();
                } else {
                    gameOver();
                }
                break;
            case "noMatch":
                // console.log('match', { meaningWord: colourlist[meaningWordIndex].word, meaningWordIndex, colourStyle: colourlist[colourStyleIndex].rgba, colourStyleIndex })
                if (meaningWordIndex !== colourStyleIndex) {
                    setScore((score) => score + 1);
                    nextCard();
                } else {
                    gameOver();
                }
                break;
            case "reset":
            default:
                // console.log('resetting choice')
                break;
        }
    }, [choice]);

    function match() {
        setChoice("match");
        setTimeout(() => setChoice((prev) => (prev = "reset")), 10);
    }
    function noMatch() {
        setChoice("noMatch");
        setTimeout(() => setChoice((prev) => (prev = "reset")), 10);
    }

    const stroopConfig = {
        gameDetails: {
            Initial: [
                { data: "Timer: 0", justifyContent: "flex-start" },
                { data: "Score: 0", justifyContent: "flex-end" },
            ],
            PlayGame: [
                {
                    data: `Timer: ${timeDisplay.toFixed(3)}`,
                    justifyContent: "flex-start",
                },
                { data: `Score: ${score}`, justifyContent: "flex-end" },
            ],
            GameOver: [
                { data: "Game over!", justifyContent: "flex-start" },
                { data: `Score: ${score}`, justifyContent: "flex-end" },
            ],
        },
        gameControls: {
            Initial: [{ buttonText: "Start game", onClick: startGame }],
            PlayGame: [
                { buttonText: "< no match", onClick: noMatch },
                { buttonText: "match >", onClick: match },
            ],
            GameOver: [{ buttonText: "Play again", onClick: startGame }],
            bindLeftArrow: noMatch,
            bindRightArrow: match,
        },
    };

    const display: GameDisplay = {
        title: "stroop effect",
        secondaryTitle: "reaction delay between congruent and incongruent stimuli",
        rules: `match the text of the 'meaning' word to the colour of the 'colour' word`,
    };

    return (
        <GameTemplate state={gameState} display={display} config={stroopConfig}>
            <Stroop state={gameState} card1={card1} card2={card2} />
        </GameTemplate>
    );
};

export default StroopEffect;
