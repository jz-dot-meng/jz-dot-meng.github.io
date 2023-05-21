//styling

type GameButtonType = {
	buttonText: string;
	onClick: () => void;
};

export const GameButton: React.FunctionComponent<GameButtonType> = ({ ...props }) => {
	const { buttonText, onClick } = props;

	return (
		<button
			className={`flex-1 p-1 rounded-md cursor-pointer text-white bg-grey-600`}
			onClick={onClick}
		>
			{buttonText}
		</button>
	);
};
