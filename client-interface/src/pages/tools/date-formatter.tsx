import { ToolWrapper } from "@components/tools/ToolWrapper";
import { formatTimeElapsed, getTimeElapsed } from "@utils/functions/datetime";
import { errorParseToString } from "@utils/functions/object";
import { BlockTimestampResponse, NearestBlockResponse } from "@utils/types/ethers";
import { api } from "@utils/wrappers/api";
import { BaseSyntheticEvent, useEffect, useState } from "react";

const DateFormatter: React.FunctionComponent = () => {
    const [unixMsVal, setUnixMsVal] = useState<number>();
    const [unixVal, setUnixVal] = useState<number>();
    const [isoString, setIsoString] = useState<string>();
    const [localeString, setLocaleString] = useState<string>();
    const [elapsedString, setElapsedString] = useState<string>();

    const [blockNumber, setBlockNumber] = useState<string>();

    const [error, setError] = useState<string>();
    const [fetchError, setFetchError] = useState<string>();

    const _fetchNearestBlock = async (unix: number) => {
        return api<NearestBlockResponse>(`/api/ethers/blockNumber?timestamp=${unix}`).then((r) => {
            if ("error" in r) {
                setFetchError(r.error);
                return;
            }
            setFetchError(undefined);
            setBlockNumber(r.data.height.toString());
        });
    };

    const _fetchBlockTimestamp = async (blockNo: number) => {
        return api<BlockTimestampResponse>(`/api/ethers/blockTimestamp?blockNo=${blockNo}`).then(
            (r) => {
                if ("error" in r) {
                    setFetchError(r.error);
                    return;
                }
                setFetchError(undefined);
                const timestamp = r.data.blockTimestamp;
                const newDate = new Date(timestamp * 1000);
                setValidDate(newDate, true);
            }
        );
    };

    const setValidDate = async (date: Date, skipBlockNumFetch = false) => {
        const ms = date.getTime();
        const unix = Math.floor(ms / 1000);
        setUnixMsVal(ms);
        setUnixVal(unix);
        setIsoString(date.toISOString());
        setLocaleString(date.toString());
        const elapsed = getTimeElapsed(Date.now(), ms);
        setElapsedString(formatTimeElapsed(elapsed, true));
        if (skipBlockNumFetch) return;
        _fetchNearestBlock(unix);
    };

    // on load
    useEffect(() => {
        const now = new Date();
        setValidDate(now);
    }, []);

    const handleUnixMsInput = (e: BaseSyntheticEvent) => {
        setError(undefined);
        try {
            // rough validation
            if (e.target.value === "") return;
            const unvalidated = Number(e.target.value);
            if (isNaN(unvalidated)) throw "not a valid unix ms timestamp";
            if (unvalidated / 10 ** 12 < 1)
                throw "not a valid unix ms timestamp (did you mean to use standard unix seconds elapsed instead?)";
            const newDate = new Date(unvalidated);
            setValidDate(newDate);
        } catch (err) {
            setError(errorParseToString(err));
        }
    };
    const handleUnixInput = (e: BaseSyntheticEvent) => {
        setError(undefined);
        try {
            // rough validation
            if (e.target.value === "") return;
            const unvalidated = Number(e.target.value);
            if (isNaN(unvalidated)) throw "not a valid unix timestamp";
            const newDate = new Date(unvalidated * 1000);
            setValidDate(newDate);
        } catch (err) {
            setError(errorParseToString(err));
        }
    };
    const handleIsoInput = (e: BaseSyntheticEvent) => {
        setError(undefined);
        try {
            const unvalidatedString = e.target.value;
            if (e.target.value === "") return;
            const newDate = new Date(unvalidatedString);
            setValidDate(newDate);
        } catch (err) {
            setError(errorParseToString(err));
        }
    };
    const handleBlockNumInput = (e: BaseSyntheticEvent) => {
        setError(undefined);
        try {
            // rough validation
            const unvalidated = Number(e.target.value);
            if (isNaN(unvalidated)) throw "not a valid block number";
            setBlockNumber(e.target.value);
            _fetchBlockTimestamp(unvalidated);
        } catch (err) {
            setError(errorParseToString(err));
        }
    };
    return (
        <ToolWrapper title="date formatter" secondaryTitle="convert between ">
            <div>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-1 gap-2 flex-col md:flex-row">
                        <div className="flex flex-1 flex-col gap-1">
                            <p>unix ms timestamp:</p>
                            <input
                                type={"text"}
                                onClick={(e) => e.stopPropagation()}
                                className={`form-control w-full h-[42px] text-white cursor-text placeholder-grey-300 flex-1 bg-grey-800 rounded-md text-xs px-3 py-3 caret-coral-400 focus:ring-transparent border-grey-400 hover:border-coral-300 focus:border-coral-400 focus:ring-coral-400`}
                                value={unixMsVal}
                                onInput={handleUnixMsInput}
                            />
                        </div>
                        <div className="flex flex-1 flex-col gap-1">
                            <p>unix second timestamp:</p>
                            <input
                                type={"text"}
                                onClick={(e) => e.stopPropagation()}
                                className={`form-control w-full h-[42px] text-white cursor-text placeholder-grey-300 flex-1 bg-grey-800 rounded-md text-xs px-3 py-3 caret-coral-400 focus:ring-transparent border-grey-400 hover:border-coral-300 focus:border-coral-400 focus:ring-coral-400`}
                                value={unixVal}
                                onInput={handleUnixInput}
                            />
                        </div>
                    </div>
                    <div className="flex flex-1 gap-2 flex-col md:flex-row">
                        <div className="flex flex-1 flex-col gap-1">
                            <p>iso timestring:</p>
                            <input
                                type={"text"}
                                onClick={(e) => e.stopPropagation()}
                                className={`form-control w-full h-[42px] text-white cursor-text placeholder-grey-300 flex-1 bg-grey-800 rounded-md text-xs px-3 py-3 caret-coral-400 focus:ring-transparent border-grey-400 hover:border-coral-300 focus:border-coral-400 focus:ring-coral-400`}
                                value={isoString}
                                onInput={handleIsoInput}
                            />
                        </div>
                        <div className="flex flex-1 flex-col gap-1">
                            <div className="flex flex-1 flex-col gap-1">
                                <p>ethereum block number:</p>
                                <input
                                    type={"text"}
                                    onClick={(e) => e.stopPropagation()}
                                    className={`form-control w-full h-[42px] text-white cursor-text placeholder-grey-300 flex-1 bg-grey-800 rounded-md text-xs px-3 py-3 caret-coral-400 focus:ring-transparent border-grey-400 hover:border-coral-300 focus:border-coral-400 focus:ring-coral-400`}
                                    value={blockNumber}
                                    onInput={handleBlockNumInput}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-1 gap-2 flex-col md:flex-row">
                        <div className="flex flex-1 flex-col gap-2">
                            <p>locale timestring:</p>
                            <p className="text-sm text-grey-400">{localeString}</p>
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                            <div className="flex flex-1 flex-col gap-1">
                                <p>time elapsed:</p>
                                <p className="text-sm text-grey-400">{elapsedString}</p>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`${
                            error || fetchError ? "visible" : "invisible"
                        } text-xs h-4 text-red-400 justify-center flex`}
                    >
                        {error || ""}
                        {fetchError || ""}
                    </div>
                </div>
            </div>
        </ToolWrapper>
    );
};
export default DateFormatter;
