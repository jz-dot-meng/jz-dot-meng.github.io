import { GameButton } from "@components/common/buttons/GameButton";
import { ToolWrapper } from "@components/tools/ToolWrapper";
import { anchorIDLConvertNewToOld, isValidAnchorIdlNew } from "@utils/functions/idl";
import { type Root as AnchorIdlOld } from '@utils/functions/idl/anchor_old';
import { debugTsPrettify, PrettifiedResult } from "@utils/functions/string";
import { BaseSyntheticEvent, JSX, useMemo, useState } from "react";
import { toast } from "react-toastify";

const AnchorIdlFormatter: React.FunctionComponent = () => {
    const [errored, setErrored] = useState<boolean>(false);
    const [unvalidatedText, setUnvalidatedText] = useState<string>();
    const [convertedIdl, setConvertedIdl] = useState<AnchorIdlOld>();
    const [prettifiedText, setPrettifiedText] = useState<string[]>();
    const [collapsedLines, setCollapsedLines] = useState<Record<number, boolean>>({});
    

    const handleTextInput = (e: BaseSyntheticEvent) => {
        const text = e.target.value;
        setUnvalidatedText(text);
    };

    const copy = () => {
        navigator.clipboard.writeText(JSON.stringify(convertedIdl));
        toast.info(`Converted IDL copied to clipboard`);
    }

    const convert = () => {
        try {
            if (!unvalidatedText) {
                setPrettifiedText(["Input text is empty"]);
                setErrored(true);
                return;
            }
            const parsed = JSON.parse(unvalidatedText); // Parse the unvalidated text

            const isValidIdl = isValidAnchorIdlNew(parsed);
            if (!isValidIdl) {
                setPrettifiedText(["Input is valid JSON but not a valid new Anchor IDL"]);
                setErrored(true);
                return
            }
            const converted = anchorIDLConvertNewToOld(parsed);
            setConvertedIdl(converted);
            // function to prettify ts 
            const prettified: PrettifiedResult = debugTsPrettify(JSON.stringify(converted)) 
            if (prettified.success) {
                setPrettifiedText(prettified.data)
                setErrored(false);
                setCollapsedLines({}); // Reset collapse state on new input
            } else if (prettified.success === false) {
                setPrettifiedText([prettified.error]);
                setErrored(true);
            }
        } catch (err) {
            console.error("Error parsing or converting IDL:", err); // Log the actual error
            let errorMessage = "An unexpected error occurred processing the IDL.";
            if (err instanceof SyntaxError) {
                // Specific feedback for JSON parsing errors, even after stripping comments
                errorMessage = `Invalid JSON input: ${err.message}. Please ensure the input is strictly valid JSON (e.g., no trailing commas, keys/strings must be quoted). Comments were stripped automatically.`;
            } else if (err instanceof Error) {
                errorMessage = `Error: ${err.message}`;
            }
            setPrettifiedText([errorMessage]);
            setErrored(true);
        }
    };

    return (
        <ToolWrapper title="anchor idl formatter" secondaryTitle="convert anchor +0.29.0 to the older format">
            <div className="flex flex-col gap-4">
                <div className="flex flex-1 gap-2 flex-col max-h-96 md:flex-row">
                    <div className="flex flex-1 flex-col gap-1">
                        <textarea
                            rows={10}
                            onInput={handleTextInput}
                            className={`form-control w-full resize-none text-white cursor-text placeholder-grey-300 flex-1 bg-grey-800 rounded-md text-xs px-3 py-3 caret-coral-400 focus:ring-transparent border-grey-400 hover:border-coral-300 focus:border-coral-400 focus:ring-coral-400 no-scrollbar`}
                        ></textarea>
                    </div>
                    <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                        <div className="flex flex-1 gap-1 bg-grey-800 rounded-md p-3 overflow-hidden">
                            <div className="flex flex-1 flex-col overflow-scroll no-scrollbar">
                                {useMemo(() => {
                                    if (!prettifiedText) return null;

                                    const linesToRender: JSX.Element[] = [];
                                    const blockEndLines: Record<number, number> = {};
                                    const stack: number[] = [];

                                    // First pass: find block start/end lines
                                    prettifiedText.forEach((line, index) => {
                                        if (line.trimEnd().endsWith("{")) {
                                            stack.push(index);
                                        } else if (line.trim().startsWith("}")) {
                                            if (stack.length > 0) {
                                                const startLine = stack.pop();
                                                if (startLine !== undefined) {
                                                    blockEndLines[startLine] = index;
                                                }
                                            }
                                        }
                                    });

                                    let skipUntilLine: number | null = null;

                                    prettifiedText.forEach((line, index) => {
                                        if (skipUntilLine !== null && index <= skipUntilLine) {
                                            if (index === skipUntilLine) {
                                                skipUntilLine = null; // End skipping
                                            }
                                            return; // Skip rendering this line
                                        }

                                        const isBlockStart = line.trimEnd().endsWith("{");
                                        const isCollapsed = collapsedLines[index];
                                        const endLine = blockEndLines[index];

                                        const handleToggleCollapse = () => {
                                            setCollapsedLines((prev) => ({
                                                ...prev,
                                                [index]: !prev[index],
                                            }));
                                        };

                                        if (isBlockStart && isCollapsed && endLine !== undefined) {
                                            skipUntilLine = endLine; // Start skipping until the end line
                                        }

                                        linesToRender.push(
                                            <div
                                                key={index}
                                                className={`flex text-xs ${
                                                    errored ? "text-red-400" : "text-grey-400"
                                                }`}
                                            >
                                                <span className="w-10 text-right pr-2 select-none flex items-center">
                                                    {isBlockStart && endLine !== undefined ? (
                                                        <button
                                                            onClick={handleToggleCollapse}
                                                            className="mr-1 text-[6px] hover:text-white focus:outline-none"
                                                        >
                                                            {isCollapsed ? "▶" : "▼"}
                                                        </button>
                                                    ) : (
                                                        <span className="w-[0.9em]"></span> // Placeholder for alignment
                                                    )}
                                                    {index + 1}
                                                </span>
                                                <span className="flex-1 whitespace-pre font-mono">
                                                    {line}
                                                    {isBlockStart &&
                                                        isCollapsed &&
                                                        endLine !== undefined && (
                                                            <span className="text-grey-500 text-xs">
                                                                {" "}
                                                                ...{" "}
                                                            </span>
                                                        )}
                                                </span>
                                            </div>
                                        );
                                    });

                                    return linesToRender;
                                }, [convertedIdl, collapsedLines, errored])}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <GameButton onClick={convert} buttonText={"Convert"} />
                    <GameButton onClick={copy} disabled={!convertedIdl} buttonText={"Copy"} />

                </div>
            </div>
        </ToolWrapper>
    );
};
export default AnchorIdlFormatter;
