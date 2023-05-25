import { useEffect, useState } from "react";

type LeftRightSelectProps = {
	options: string[];
	selection: number;
	style?: any;
	onChange: (newSelection: number) => void;
};

export const LeftRightSelect: React.FunctionComponent<LeftRightSelectProps> = ({ ...props }) => {
	const { options, selection, style, onChange } = props;

	const [currentSelection, setCurrentSelection] = useState<number>(0);

	/**
	 * initialise
	 */
	useEffect(() => {
		setCurrentSelection(selection);
	}, []);

	/**
	 * Handle left arrow click
	 */
	const leftSelect = () => {
		let newSelection: number;
		if (currentSelection === 0) {
			newSelection = options.length - 1;
			setCurrentSelection(newSelection);
		} else {
			newSelection = currentSelection - 1;
			setCurrentSelection(newSelection);
		}
		onChange(newSelection);
	};

	/**
	 * Handle right arrow click
	 */
	const rightSelect = () => {
		let newSelection: number;
		if (currentSelection === options.length - 1) {
			newSelection = 0;
			setCurrentSelection(newSelection);
		} else {
			newSelection = currentSelection + 1;
			setCurrentSelection(newSelection);
		}
		onChange(newSelection);
	};

	return (
		<>
			<div
				style={style}
				className="text-white w-full flex rounded-md bg-grey-600 py-1 items-center justify-center text-sm"
			>
				<div
					className="cursor-pointer px-4 h-fit mb-1 flex items-center"
					onClick={leftSelect}
				>
					&lsaquo;
				</div>
				<div
					style={{
						width: "150px",
						textAlign: "center",
					}}
				>
					{options[currentSelection]}
				</div>
				<div
					className="cursor-pointer px-4 h-fit mb-1 flex items-center"
					onClick={rightSelect}
				>
					&rsaquo;
				</div>
			</div>
		</>
	);
};
