import { Header } from "@components/common/header/Header";
import { DevFooter } from "@components/navigation/DevFooter";
import { HorizontalLinks } from "@components/navigation/HorizontalLinks";
import { gamesLinkMap } from "@constants";
import { GameDetails, GameDisplay } from "@utils/types/minigame";
import React, { ReactNode } from "react";
import { GameControls } from "./GameControls";
import { GameDetailsTracker } from "./GameDetailsTracker";

export enum GameStates {
    "Initial" = "Initial",
    "PlayGame" = "PlayGame",
    "GameOver" = "GameOver",
}

type GameTemplateProps = {
    state: keyof typeof GameStates;
    children: ReactNode;
    display: GameDisplay;
    config: {
        gameDetails: GameDetails;
        gameControls: {
            [GameStates.Initial]?: any[];
            [GameStates.PlayGame]?: any[];
            [GameStates.GameOver]?: any[];
            bindLeftArrow?: () => void;
            bindRightArrow?: () => void;
            bindUpArrow?: () => void;
            bindDownArrow?: () => void;
        };
    };
};

export const GameTemplate: React.FunctionComponent<GameTemplateProps> = ({ ...props }) => {
    const { children, config, display, state } = props;

    return (
        <div className="flex justify-center flex-col items-center h-full overflow-hidden p-6 md:p-8">
            <div className="flex flex-col gap-4 w-11/12 md:w-1/2 overflow-scroll no-scrollbar">
                <div className="flex flex-col gap-2 md:gap-4">
                    <Header />
                    <div className="flex items-start flex-col gap-1 md:items-end md:flex-row">
                        <h1>{display.title}</h1>
                        <span className="pb-2"> :: {display.secondaryTitle}</span>
                    </div>
                    <HorizontalLinks linkMap={gamesLinkMap} isInternalLink={true} />
                </div>
                <div className="flex flex-col gap-4">
                    <p>{display.rules}</p>

                    <div className="w-full flex flex-col gap-2">
                        <div>
                            <GameDetailsTracker state={state} details={config.gameDetails} />
                        </div>
                        <div className="min-h-[200px] flex items-center justify-center">
                            {children}
                        </div>
                        <div>
                            <GameControls state={state} controls={config.gameControls} />
                        </div>
                    </div>
                </div>
                <DevFooter />
            </div>
        </div>
    );
};
