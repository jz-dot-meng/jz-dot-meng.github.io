import { GameStates, GameTemplate } from "@components/game/GameTemplate";
import { MemoryTiles } from "@components/game/interfaces/MemoryTiles";
import React, { useState } from "react";

//styling
import { GameDisplay } from "@utils/types/minigame";

export enum MemoryDisplayMode {
    "Memorise" = "Memorise",
    "Guess" = "Guess",
    "GameOver" = "GameOver",
}

const MEMORY_LEVELS = [
    { level: 0, dim: [4, 4], tiles: 0 },
    { level: 1, dim: [4, 4], tiles: 3 },
    { level: 2, dim: [4, 4], tiles: 4 },
    { level: 3, dim: [4, 4], tiles: 5 },
    { level: 4, dim: [4, 4], tiles: 6 },
    { level: 5, dim: [4, 4], tiles: 7 },
    { level: 6, dim: [5, 4], tiles: 7 },
    { level: 7, dim: [5, 4], tiles: 8 },
    { level: 8, dim: [5, 4], tiles: 9 },
    { level: 9, dim: [5, 4], tiles: 10 },
    { level: 10, dim: [5, 4], tiles: 11 },
    { level: 11, dim: [5, 5], tiles: 11 },
    { level: 12, dim: [5, 5], tiles: 12 },
    { level: 13, dim: [5, 5], tiles: 13 },
    { level: 14, dim: [5, 5], tiles: 14 },
    { level: 15, dim: [5, 5], tiles: 15 },
    { level: 16, dim: [6, 5], tiles: 15 },
    { level: 17, dim: [6, 5], tiles: 16 },
    { level: 18, dim: [6, 5], tiles: 17 },
    { level: 19, dim: [6, 5], tiles: 18 },
    { level: 20, dim: [6, 5], tiles: 19 },
];

const Memory: React.FunctionComponent = () => {
    const [gameState, setGameState] = useState<keyof typeof GameStates>("Initial");
    const [displayMode, setDisplayMode] = useState<keyof typeof MemoryDisplayMode>("Memorise");

    const [level, setLevel] = useState<number>(0);
    const [levelSelectionIndices, setLevelSelectionIndices] = useState<number[]>([]);

    const generateArray = (level: number) => {
        const levelTileCount = MEMORY_LEVELS[level].tiles;
        const totalLevelTiles = MEMORY_LEVELS[level].dim[0] * MEMORY_LEVELS[level].dim[1];
        const levelSet = new Set<number>();
        while (levelSet.size < levelTileCount) {
            levelSet.add(Math.floor(Math.random() * totalLevelTiles));
        }
        setLevelSelectionIndices(Array.from(levelSet));
    };

    const startGame = () => {
        // cleanup
        for (let i = 0; i < 16; i++) {
            try {
                document.getElementById(`tile-${i}`)?.classList.remove("memory-correctSelection");
            } catch (e) {
                // doesn't have class already
            }
        }
        const nextLevel = 1;
        setLevel(nextLevel);
        setGameState("PlayGame");
        setDisplayMode("Memorise");
        generateArray(nextLevel);
        setTimeout(function () {
            setDisplayMode("Guess");
        }, 1500);
    };

    const handleNextLevel = () => {
        const nextLevel = level + 1;
        setLevel(nextLevel);
        setDisplayMode("Memorise");
        generateArray(nextLevel);
        setTimeout(function () {
            setDisplayMode("Guess");
        }, 1500);
    };

    const handleGameOver = () => {
        setGameState("GameOver");
        setDisplayMode("GameOver");
    };

    const memoryConfig = {
        gameDetails: {
            Initial: [{ data: "Start the game", justifyContent: "flex-start" }],
            PlayGame: [{ data: `Level ${level}` }],
            GameOver: [{ data: `Game over: level ${level}` }],
        },
        gameControls: {
            Initial: [{ buttonText: "Start game", onClick: startGame }],
            PlayGame: [],
            GameOver: [{ buttonText: "Play again", onClick: startGame }],
        },
    };

    const display: GameDisplay = {
        title: "memory game",
        secondaryTitle: "how far can you get?",
        rules: "select the tiles shown at the beginning of each level",
    };

    return (
        <GameTemplate state={gameState} display={display} config={memoryConfig}>
            <MemoryTiles
                state={gameState}
                display={displayMode}
                grid={MEMORY_LEVELS[level].dim}
                levelSelection={levelSelectionIndices}
                handleNextLevel={handleNextLevel}
                handleGameOver={handleGameOver}
                preventClick={() => setDisplayMode("Memorise")}
            />
        </GameTemplate>
    );
};

export default Memory;
