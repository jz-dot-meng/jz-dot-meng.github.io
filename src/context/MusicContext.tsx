import { LiveIcon } from "@components/common/data/LiveIcon";
import {
    LastFm,
    RecentTracksResponse,
    WeeklyArtistReponse,
    WeeklyTrackReponse,
} from "@utils/types/music";
import { api } from "@utils/wrappers/api";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BehaviorSubject, filter, from, map, switchMap, takeUntil, timer } from "rxjs";

interface MusicOverview {
    latestTracks: LastFm.Track[];
    weeklyTracks: LastFm.Track_Rank[];
    weeklyArtists: LastFm.Artist_Rank[];
    init: () => Promise<void>;
}
const MusicContext = createContext<MusicOverview | undefined>(undefined);

export const useMusicContext = () => {
    const musicContext = useContext(MusicContext);
    if (musicContext === undefined) {
        throw new Error("MusicContext not defined");
    }
    return musicContext;
};

export const MusicContextProvider = ({ children }: { children: ReactNode }) => {
    const [latestTracks, setLastestTracks] = useState<LastFm.Track[]>([]);
    const [weeklyTracks, setWeeklyTracks] = useState<LastFm.Track_Rank[]>([]);
    const [weeklyArtists, setWeeklyArtists] = useState<LastFm.Artist_Rank[]>([]);

    const [nowListening, setNowListening] = useState<LastFm.Track>();
    const [stop$] = useState<BehaviorSubject<boolean>>(new BehaviorSubject<boolean>(false));

    const [baseUrl, setBaseUrl] = useState<string>("");

    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            // console.log("is dev!");
            setBaseUrl("");
        } else {
            setBaseUrl("https://jz-dot-meng.vercel.app");
        }
    }, []);

    const init = async () => {
        _fetchRecentTracks().then((tracks) => {
            // check first track for now listening
            if (!tracks) return;
            setLastestTracks(tracks);
            const latestTrack = tracks[0];
            if ("@attr" in latestTrack && latestTrack["@attr"].nowplaying === "true") {
                setNowListening(latestTrack);
                _startListener();
            }
        });
        _fetchWeeklyTracks().then((weekly) => {
            if (!weekly) return;
            setWeeklyTracks(weekly.slice(0, 20));
        });
        _fetchWeeklyArtists().then((weekly) => {
            if (!weekly) return;
            setWeeklyArtists(weekly.slice(0, 20));
        });
    };

    const _fetchRecentTracks = async () => {
        return api<RecentTracksResponse>(`${baseUrl}/api/music/recentTracks`).then((data) => {
            if (!data.success) {
                toast.error(`Unable to fetch recent tracks: ${data.error}`);
                return undefined;
            }
            // console.log({ data });
            return data.data.recenttracks.track;
        });
    };

    const _fetchWeeklyTracks = async () => {
        return api<WeeklyTrackReponse>(`${baseUrl}/api/music/weeklyTop?type=tracks`).then(
            (data) => {
                if (!data.success) {
                    toast.error(`Unable to fetch top weekly tracks: ${data.error}`);
                    return undefined;
                }
                // console.log({ data });
                return data.data.weeklytrackchart.track;
            }
        );
    };

    const _fetchWeeklyArtists = async () => {
        return api<WeeklyArtistReponse>(`${baseUrl}/api/music/weeklyTop?type=artists`).then(
            (data) => {
                if (!data.success) {
                    toast.error(`Unable to fetch top weekly artists: ${data.error}`);
                    return undefined;
                }
                // console.log({ data });
                return data.data.weeklyartistchart.artist;
            }
        );
    };

    const _displayNowListeningToast = (track: LastFm.Track) => {
        const Msg = () => {
            return (
                <div className="flex gap-2 items-center">
                    <div className="h-fit">
                        <img
                            src={track.image[3]["#text"]}
                            width={50}
                            height={50}
                            alt="album-cover"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <LiveIcon />
                            <div className="text-xs text-grey-400">Now listening to:</div>
                        </div>
                        <div className="text-sm">{track.name}</div>
                        <div className="text-xs">{track.artist.name}</div>
                    </div>
                </div>
            );
        };
        toast(Msg);
    };

    const _startListener = () => {
        stop$.next(true);
        setTimeout(() => {
            stop$.next(false);
            // console.log("subscribing to now listening poller!");
            timer(0, 60000)
                .pipe(
                    takeUntil(stop$.pipe(filter((stop) => stop))),
                    switchMap(() => from(_fetchRecentTracks())),
                    map((tracks) => {
                        if (!tracks) return;
                        setLastestTracks(tracks);
                        const latestTrack = tracks[0];
                        if ("@attr" in latestTrack && latestTrack["@attr"].nowplaying === "true") {
                            console.log({ latest: latestTrack.mbid, prev: nowListening?.mbid });
                            if (latestTrack.mbid === nowListening?.mbid) {
                                // console.log("still listening to previous song");
                                return;
                            }
                            // console.log("new listening to!");
                            _displayNowListeningToast(latestTrack);
                            setNowListening(latestTrack);
                        }
                    })
                )
                .subscribe()
                .add(() => "unsubscribing");
        }, 250);
    };
    return (
        <MusicContext.Provider value={{ init, latestTracks, weeklyArtists, weeklyTracks }}>
            {children}
        </MusicContext.Provider>
    );
};
