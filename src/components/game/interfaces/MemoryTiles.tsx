import { useEffect, useState } from "react";
import { MemoryDisplayMode } from "../../../pages/memory";
import { GameStates } from "../GameTemplate";

import styles from "./MemoryTiles.module.css";

type MemoryTilesType = {
  state: keyof typeof GameStates;
  display: keyof typeof MemoryDisplayMode;
  grid: number[];
  levelSelection: number[];
  preventClick: () => void;
  handleNextLevel: () => void;
  handleGameOver: () => void;
};

export const MemoryTiles: React.FunctionComponent<MemoryTilesType> = ({
  ...props
}) => {
  const {
    state,
    display,
    grid,
    levelSelection,
    handleNextLevel,
    handleGameOver,
    preventClick,
  } = props;

  const [tileMap, setTileMap] = useState<number[]>([]);
  const [selectionSplicer, setSelectionSplicer] = useState<number[]>([]);

  useEffect(() => {
    // draw board
    const total = grid[0] * grid[1];
    const newLevelArray = [];
    for (let i = 0; i < total; i++) {
      newLevelArray.push(i);
    }
    setTileMap(newLevelArray);
    // console.log(newLevelArray)
  }, [grid]);

  useEffect(() => {
    setSelectionSplicer([]);
  }, [levelSelection]);

  const removeAllSelectedTileClass = (array: number[]) => {
    array.forEach((number) => {
      document
        .getElementById(`tile-${number}`)
        ?.classList.remove("memory-correctSelection");
    });
  };

  const handleAllCorrectTilesSelected = (allSelectedTiles: number[]) => {
    // not ideal to nest timeout in a timeout?
    preventClick();
    setTimeout(function () {
      removeAllSelectedTileClass(allSelectedTiles);
      setTimeout(function () {
        handleNextLevel();
      }, 500);
    }, 500);
  };

  const validateTile = (index: number, e: any) => {
    const indexInSelection = levelSelection.indexOf(index);
    if (indexInSelection === -1 && selectionSplicer.indexOf(index) === -1) {
      handleGameOver();
    } else {
      e.target.classList.add("memory-correctSelection");
      if (selectionSplicer.indexOf(index) !== -1) {
        // already selected;
        return;
      }
      // check if all tiles have been selected
      const copy = selectionSplicer.slice();
      copy.push(...levelSelection.splice(indexInSelection, 1));
      setSelectionSplicer(copy);
      if (levelSelection.length === 0) {
        handleAllCorrectTilesSelected(copy);
      }
    }
  };

  return (
    <>
      <div
        style={{
          visibility: state !== "Initial" ? "visible" : "hidden",
        }}
        className={styles.memoryTilesContainer}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${grid[0]}, 40px)`,
            gridTemplateRows: `repeat(${grid[1]},40px)`,
          }}
        >
          {tileMap.map((number) => (
            <button
              key={number}
              id={`tile-${number}`}
              className={`${styles.memoryGameTile} 
                                ${
                                  display === "Memorise"
                                    ? levelSelection.indexOf(number) !== -1
                                      ? "memory-correctSelection"
                                      : ""
                                    : ""
                                } 
                                ${
                                  display === "GameOver"
                                    ? levelSelection.indexOf(number) !== -1 &&
                                      selectionSplicer.indexOf(number) === -1
                                      ? "memory-missingSelection"
                                      : ""
                                    : ""
                                }
                                `}
              onClick={(e) => validateTile(number, e)}
              disabled={display !== "Guess"}
            ></button>
          ))}
        </div>
      </div>
    </>
  );
};
