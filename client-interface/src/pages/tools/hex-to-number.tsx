import { ToolWrapper } from "@components/tools/ToolWrapper";
import React, { BaseSyntheticEvent, useState } from "react";

const HexToNumber: React.FunctionComponent = () => {
    const [hexVal, setHexVal] = useState<string>();
    const [numberVal, setNumberVal] = useState<string>();
    const [error, setError] = useState<string>();

    const handleHexInput = (e: BaseSyntheticEvent) => {
        setError(undefined);
        const unvalidatedHex = e.target.value;
        setHexVal(unvalidatedHex);
        if (unvalidatedHex === "") {
            setNumberVal("");
            return;
        }
        const parsedNumber = Number(unvalidatedHex);
        if (isNaN(parsedNumber)) {
            setError("not a valid hex value");
            return;
        }
        setNumberVal(parsedNumber.toString());
    };

    const handleNumberInput = (e: BaseSyntheticEvent) => {
        setError(undefined);
        const unvalidatedNumber = e.target.value;
        setNumberVal(unvalidatedNumber);
        if (unvalidatedNumber === "") {
            setHexVal("");
            return;
        }
        const parsedNumber = Number(unvalidatedNumber);
        if (isNaN(parsedNumber)) {
            setError("not a valid number");
            return;
        }
        setHexVal(`0x${parsedNumber.toString(16)}`);
    };

    return (
        <ToolWrapper title="hex to number" secondaryTitle="convert between hex and number">
            <div>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-1 gap-2 flex-col md:flex-row">
                        <div className="flex flex-1 flex-col gap-1">
                            <p>hex:</p>
                            <input
                                type={"text"}
                                onClick={(e) => e.stopPropagation()}
                                className={`form-control w-full h-[42px] text-white cursor-text placeholder-grey-300 flex-1 bg-grey-800 rounded-md text-xs px-3 py-3 caret-coral-400 focus:ring-transparent border-grey-400 hover:border-coral-300 focus:border-coral-400 focus:ring-coral-400`}
                                value={hexVal}
                                onInput={handleHexInput}
                            />
                        </div>
                        <div className="flex flex-1 flex-col gap-1">
                            <p>number:</p>
                            <input
                                type={"text"}
                                onClick={(e) => e.stopPropagation()}
                                className={`form-control w-full h-[42px] text-white cursor-text placeholder-grey-300 flex-1 bg-grey-800 rounded-md text-xs px-3 py-3 caret-coral-400 focus:ring-transparent border-grey-400 hover:border-coral-300 focus:border-coral-400 focus:ring-coral-400`}
                                value={numberVal}
                                onInput={handleNumberInput}
                            />
                        </div>
                    </div>
                    <div
                        className={`${
                            error ? "visible" : "invisible"
                        } text-xs h-4 text-red-400 justify-center flex`}
                    >
                        {error}
                    </div>
                </div>
            </div>
        </ToolWrapper>
    );
};

export default HexToNumber;
