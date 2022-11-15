import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { GameStates, GameTemplate } from "../../components/game/GameTemplate";
import { Stroop } from "../../components/game/interfaces/Stroop";
import { ULHorizontalInternalLinks } from "../../components/navigation/ULInternalLinks";
import { gamesLinkMap } from "../../constants";

//styling
import styles from "../../styles/Home.module.css";

enum Choice {
  "match" = "match",
  "noMatch" = "noMatch",
  "reset" = "reset",
}

const StroopEffect: React.FunctionComponent = () => {
  const [gameState, setGameState] =
    useState<keyof typeof GameStates>("Initial");

  const [time, setTime] = useState<number>(0);
  const timer = useRef<NodeJS.Timer>();
  const [score, setScore] = useState<number>(0);

  const [card1, setCard1] = useState<any>(undefined);
  const [card2, setCard2] = useState<any>(undefined);

  const [meaningWordIndex, setMeaningWordIndex] = useState<number>(0);
  const [colourWordIndex, setColourWordIndex] = useState<number>(0);
  const [colourStyleIndex, setColourStyleIndex] = useState<number>(0);

  const colourlist = [
    { word: "red", rgba: "rgba(255,0,0,0.9)" },
    { word: "blue", rgba: "rgba(0,0,255,0.9)" },
    { word: "green", rgba: "rgba(0,255,0,0.8)" },
    { word: "cyan", rgba: "rgba(0,255,255,0.8)" },
    { word: "purple", rgba: "rgba(204,0,255,1)" },
    { word: "yellow", rgba: "rgba(245,245,0,0.9)" },
    { word: "orange", rgba: "rgba(255,153,51,0.9)" },
  ];

  const nextCard = () => {
    // skew to roughly half match, half no match
    let prob = Math.random();
    const mwi = Math.floor(Math.random() * (colourlist.length - 0.1)); // temp variable to be able to quickly set to two states
    setMeaningWordIndex(mwi);
    // let colourStyleIndex
    let csi;
    if (prob < 0.4) {
      csi = mwi;
      setColourStyleIndex(mwi); // meaning matches colour
    } else {
      csi = Math.floor(Math.random() * (colourlist.length - 0.1));
      setColourStyleIndex(csi);
    }
    const cwi = Math.floor(Math.random() * (colourlist.length - 0.1));
    setColourWordIndex(cwi);
    // figure out which card to generate meaning/colour
    let leftright = Math.random();
    if (leftright < 0.5) {
      setCard1({
        cardWord: colourlist[mwi].word,
        cardType: "meaning",
        wordStyle: {
          color: "rgba(0,0,0,1)",
        },
      });
      setCard2({
        cardWord: colourlist[cwi].word,
        cardType: "colour",
        wordStyle: {
          color: colourlist[csi].rgba,
        },
      });
    } else {
      setCard1({
        cardWord: colourlist[cwi].word,
        cardType: "colour",
        wordStyle: {
          color: colourlist[csi].rgba,
        },
      });
      setCard2({
        cardWord: colourlist[mwi].word,
        cardType: "meaning",
        cardStyle: {
          color: "rgba(0,0,0,1)",
        },
      });
    }
  };

  const startGame = () => {
    // console.log('startgame')
    setTime(45);
    setScore(0);
    nextCard();
    setGameState("PlayGame");
    let newGameTimer = setInterval(() => countdownFunc(), 100);
    timer.current = newGameTimer;
  };

  const gameOver = () => {
    // console.log('gameover')
    setTime((time) => (time = 0));
    setGameState("GameOver");
    setChoice("reset");
  };

  function countdownFunc() {
    if (time <= 0 && gameState === "PlayGame") {
      // console.log('countdown gameover')
      setGameState("GameOver");
    } else {
      setTime((time) => Number((time - 0.1).toFixed(3)));
    }
  }

  useEffect(() => {
    // console.log('setting data', { meaningWord: colourlist[meaningWordIndex].word, colourWord: colourlist[colourWordIndex].word, colourStyle: colourlist[colourStyleIndex].rgba })
  }, [meaningWordIndex, colourStyleIndex, colourWordIndex, card1, card2, time]);

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
        { data: `Timer: ${time.toFixed(3)}`, justifyContent: "flex-start" },
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
        { buttonText: "&#60;&nbsp;&nbsp;no match", onClick: noMatch },
        { buttonText: "match&nbsp;&nbsp;&#62;", onClick: match },
      ],
      GameOver: [{ buttonText: "Play again", onClick: startGame }],
      bindLeftArrow: noMatch,
      bindRightArrow: match,
    },
  };

  return (
    <>
      <div className={styles.mainHeader}>
        <h4>
          <Link href="/">@jz-dot-meng</Link>
        </h4>
        <h1>
          stroop effect
          <span>
            {" "}
            :: reaction delay between congruent and incongruent stimuli
          </span>
        </h1>
        <ULHorizontalInternalLinks linkMap={gamesLinkMap} />
      </div>
      <div className={styles.mainBody}>
        <p>
          match the text of the 'meaning' word to the colour of the 'colour'
          word
        </p>
        <GameTemplate state={gameState} config={stroopConfig}>
          <Stroop state={gameState} card1={card1} card2={card2} />
        </GameTemplate>
      </div>
    </>
  );
};

export default StroopEffect;
