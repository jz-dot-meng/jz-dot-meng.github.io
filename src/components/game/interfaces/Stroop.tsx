import { GameCard } from "../../common/game/GameCard";
import { GameStates } from "../GameTemplate";
//styling
import styles from "./Stroop.module.css";

type StroopType = {
	state: keyof typeof GameStates;
	card1:
		| {
				cardType: string;
				cardWord: string;
				wordStyle: any;
		  }
		| undefined;
	card2:
		| {
				cardType: string;
				cardWord: string;
				wordStyle: any;
		  }
		| undefined;
};

export const Stroop: React.FunctionComponent<StroopType> = ({ ...props }) => {
	const { state, card1, card2 } = props;

	return (
		<>
			<div
				style={{ visibility: state === "PlayGame" ? "visible" : "hidden" }}
				className="flex justify-center items-center gap-2 px-1 md:px-2 flex-col md:flex-row"
			>
				<GameCard
					cardTitle={card1?.cardWord}
					cardSubTitle={card1?.cardType}
					cardTitleStyle={card1?.wordStyle}
				/>
				<GameCard
					cardTitle={card2?.cardWord}
					cardSubTitle={card2?.cardType}
					cardTitleStyle={card2?.wordStyle}
				/>
			</div>
		</>
	);
};
