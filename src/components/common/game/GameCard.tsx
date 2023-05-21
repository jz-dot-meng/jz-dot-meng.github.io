type GameCardProps = {
	cardTitle?: string;
	cardTitleStyle?: any;
	cardSubTitle?: string;
	cardSubTitleStyle?: any;
};

export const GameCard: React.FunctionComponent<GameCardProps> = ({ ...props }) => {
	const { cardTitle, cardTitleStyle, cardSubTitle, cardSubTitleStyle } = props;
	return (
		<>
			<div className="flex items-center justify-center flex-col border rounded-md py-8 px-20 w-4/5 md:w-2/5">
				<div className="px-1" style={cardSubTitleStyle}>
					{cardSubTitle}
				</div>
				<div className="px-1 text-4xl" style={cardTitleStyle}>
					{cardTitle}
				</div>
			</div>
		</>
	);
};
