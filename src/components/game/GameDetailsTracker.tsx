import { useEffect, useState } from "react";
import { GameStates } from "./GameTemplate";

//styling
import styles from "./Game.module.css";

type GameDetailsTrackerType = {
  state: keyof typeof GameStates;
  details: {
    [GameStates.Initial]?: any[];
    [GameStates.PlayGame]?: any[];
    [GameStates.GameOver]?: any[];
  };
};

export const GameDetailsTracker: React.FunctionComponent<
  GameDetailsTrackerType
> = ({ ...props }) => {
  const { state, details } = props;

  const [detailsArray, setDetailsArray] = useState<any[] | undefined>([]);

  useEffect(() => {
    switch (state) {
      case "Initial":
        setDetailsArray(details.Initial);
        break;
      case "PlayGame":
        setDetailsArray(details.PlayGame);
        break;
      case "GameOver":
        setDetailsArray(details.GameOver);
        break;
    }
  }, [state, details]);

  return (
    <>
      <div className={styles.gameFlex}>
        {detailsArray?.map((details, index) => (
          <div
            key={index}
            className={`${styles.gameFlex} ${styles.gameFlex1}`}
            style={{
              justifyContent: details.justifyContent,
            }}
          >
            <div className={styles.gameFitC}>{details.data}</div>
          </div>
        ))}
      </div>
    </>
  );
};
