import React, { useEffect, useState } from "react";
import { GameStates } from "./GameTemplate";

type GameDetailsTrackerType = {
    state: keyof typeof GameStates;
    details: {
        [GameStates.Initial]?: any[];
        [GameStates.PlayGame]?: any[];
        [GameStates.GameOver]?: any[];
    };
};

export const GameDetailsTracker: React.FunctionComponent<GameDetailsTrackerType> = ({
    ...props
}) => {
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
            <div className="flex">
                {detailsArray?.map((details, index) => (
                    <div
                        key={index}
                        className={`flex flex-1`}
                        style={{
                            justifyContent: details.justifyContent,
                        }}
                    >
                        <div className="w-fit">{details.data}</div>
                    </div>
                ))}
            </div>
        </>
    );
};
