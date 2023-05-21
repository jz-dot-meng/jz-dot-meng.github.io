export interface GameDisplay {
	title: string;
	secondaryTitle: string;
	rules: string;
}

export enum GameStates {
	"Initial" = "Initial",
	"PlayGame" = "PlayGame",
	"GameOver" = "GameOver",
}

export interface GameDetails {
	[GameStates.Initial]?: any[];
	[GameStates.PlayGame]?: any[];
	[GameStates.GameOver]?: any[];
}

export interface GameControls {
	[GameStates.Initial]?: any[];
	[GameStates.PlayGame]?: any[];
	[GameStates.GameOver]?: any[];
	bindLeftArrow?: () => void;
	bindRightArrow?: () => void;
	bindUpArrow?: () => void;
	bindDownArrow?: () => void;
}
