import { TrackItem } from "@components/music/TrackItem";
import { LastFm, RecentTracksResponse } from "@utils/types/music";
import { api } from "@utils/wrappers/api";
import { useMusicContext } from "context/MusicContext";
import Link from "next/link";
import { useEffect } from "react";

const RecentlyListened: React.FunctionComponent = () => {
	const { init, latestTracks } = useMusicContext();

	useEffect(() => {
		init();
	}, []);
	return (
		<div className="flex h-full p-8">
			<div className="flex flex-col gap-2 w-full">
				<section className="flex flex-col gap-4">
					<h4>
						<Link href="/">@jz-dot-meng</Link>
					</h4>
					<div className="flex items-start flex-col gap-1 md:items-end md:flex-row">
						<h1>recently listened</h1>
						<span className="pb-2"> :: live data for your perusal</span>
					</div>
				</section>
				<section className="py-4 md:py-8 flex flex-col md:flex-row gap-4 overflow-hidden">
					<div className="flex flex-[2] flex-col gap-1 overflow-hidden">
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
					<div className="flex flex-1">{/** top tracks week */}</div>
				</section>
			</div>
		</div>
	);
};
export default RecentlyListened;
