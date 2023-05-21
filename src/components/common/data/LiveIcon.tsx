interface LiveIconProps {
	pad?: "left" | "right" | undefined;
	width?: string;
	height?: string;
}

export const LiveIcon: React.FunctionComponent<LiveIconProps> = ({ ...props }) => {
	const { pad, width, height } = props;
	return (
		<div
			className={`${
				pad === "left" ? "pl-1" : pad === "right" ? "pr-1" : ""
			} flex items-center justify-center`}
		>
			<span
				className={`relative flex ${width ? width : "w-[6px]"} ${
					height ? height : "h-[6px]"
				}`}
			>
				<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
				<span className="relative inline-flex rounded-full h-full w-full bg-red-400"></span>
			</span>
		</div>
	);
};
