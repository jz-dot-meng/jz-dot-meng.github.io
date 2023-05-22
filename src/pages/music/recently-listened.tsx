import { TrackItem } from "@components/music/TrackItem";
import { WeeklyTop } from "@components/music/WeeklyTop";
import { useMusicContext } from "context/MusicContext";
import Link from "next/link";
import { useEffect } from "react";

const RecentlyListened: React.FunctionComponent = () => {
	const { init, latestTracks, weeklyArtists, weeklyTracks } = useMusicContext();

	useEffect(() => {
		init();
	}, []);
	return (
		<div className="flex h-full p-8 overflow-scroll md:overflow-hidden">
			<div className="flex flex-col gap-2 w-full">
				<section className="flex flex-col gap-4">
					<h4>
						<Link href="/">@jz-dot-meng</Link>
					</h4>
					<div className="flex items-start flex-col gap-1 md:items-end md:flex-row">
						<h1>recently listened</h1>
						<span className="pb-2"> :: deep dive into my music tastes</span>
					</div>
				</section>
				<section className="py-4 md:py-8 flex flex-col md:flex-row gap-4 md:overflow-hidden">
					<div className="flex md:flex-[2] flex-col gap-1 overflow-hidden max-h-80 md:max-h-full">
						{/** recently listened */}
						<div className="flex gap-1 p-2 border-b border-white text-sm">
							<div className="flex-1 flex items-center">{/**image*/}</div>
							<div className="flex-[2] flex items-center">Name & Album</div>
							<div className="flex-1 flex items-center">Artist</div>
							<div className="flex-1 flex items-center">Last listened</div>
						</div>
						<div className="flex flex-col gap-1 overflow-y-scroll no-scrollbar">
							{latestTracks.map((track, index) => (
								<TrackItem track={track} key={`${index}-${track.mbid}`} />
							))}
						</div>
					</div>
					<div className="flex flex-col flex-1 max-h-80 md:max-h-full overflow-hidden">
						{/** top week */}
						<WeeklyTop />
					</div>
				</section>
			</div>
		</div>
	);
};
export default RecentlyListened;
