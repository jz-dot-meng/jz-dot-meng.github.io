import { ReactNode, useEffect } from "react";
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
	config: {
		gameDetails: {
			[GameStates.Initial]?: any[];
			[GameStates.PlayGame]?: any[];
			[GameStates.GameOver]?: any[];
		};
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
	const { children, config, state } = props;

	return (
		<div className="w-full flex flex-col gap-2">
			<div>
				<GameDetailsTracker state={state} details={config.gameDetails} />
			</div>
			<div className="min-h-[200px] flex items-center justify-center">{children}</div>
			<div>
				<GameControls state={state} controls={config.gameControls} />
			</div>
		</div>
	);
};
