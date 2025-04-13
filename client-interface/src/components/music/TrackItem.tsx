import { LastFm } from "@utils/types/music";
import React, { useMemo } from "react";
import { formatTimeElapsed, getTimeElapsed } from "simple-tools";
import { LiveIcon } from "../common/data/LiveIcon";

interface TrackItemProps {
    track: LastFm.Track;
}
export const TrackItem: React.FunctionComponent<TrackItemProps> = ({ track }) => {
    const nowPlaying = useMemo(() => "@attr" in track && track["@attr"]?.nowplaying, [track]);
    const timeSincePlay = useMemo(() => {
        if (!("date" in track)) return undefined;
        const now = Date.now();
        return getTimeElapsed(now, Number(track.date.uts) * 1000);
    }, [track]);

    return (
        <div className="flex gap-1 py-2">
            <div className="flex-1 flex items-center justify-center">
                <img src={track.image[2]["#text"]} width={40} height={40} alt="album-cover" />
            </div>
            <a className="flex-[2] flex-col flex justify-center" href={track.url} target={"_blank"}>
                <div>{track.name}</div>
                <div className="text-xs text-grey-300">{track.album["#text"]}</div>
            </a>
            <div className="flex-1 flex items-center text-xs md:text-base">{track.artist.name}</div>
            <div className="flex-1 flex gap-2 text-grey-600 items-center text-xs md:text-base">
                {nowPlaying ? (
                    <>
                        <LiveIcon />
                        <div>Now playing</div>
                    </>
                ) : timeSincePlay ? (
                    `${formatTimeElapsed(timeSincePlay)}`
                ) : (
                    ""
                )}
            </div>
        </div>
    );
};
