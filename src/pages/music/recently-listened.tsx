import { getTimeElapsed } from "@utils/functions/datetime";
import { LastFm, RecentTracksResponse } from "@utils/types/music";
import { api } from "@utils/wrappers/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const RecentlyListened: React.FunctionComponent = () => {
	const [now] = useState<number>(Date.now());

	const [latestTracks, setLastestTracks] = useState<LastFm.Track[]>([]);

	useEffect(() => {
		// full call - github pages cannot call 'server' api
		//  api<RecentTracksResponse>("/api/music/recentTracks").then(
		api<RecentTracksResponse>("https://jz-dot-meng.vercel.app/api/music/recentTracks").then(
			(data) => {
				if (!data.success) {
					// toast
					toast.error(`Unable to fetch recent tracks: ${data.error}`);
					return;
				}
				console.log({ data });
				setLastestTracks(data.data.recenttracks.track);
			}
		);
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
				<section className="py-8 flex flex gap-4 overflow-hidden">
					<div className="flex flex-[2] flex-col gap-1">
						{/** recently listened */}
						<div className="flex gap-1 p-2 border-b border-white">
							<div className="flex-1 flex items-center">{/**image*/}</div>
							<div className="flex-[2] flex items-center">Name & Album</div>
							<div className="flex-1 flex items-center">Artist</div>
							<div className="flex-1 flex items-center">Last listened</div>
						</div>
						<div className="flex flex-col gap-1 overflow-y-scroll no-scrollbar">
							{latestTracks.map((track, index) => {
								const timeSincePlay = getTimeElapsed(
									now,
									Number(track.date.uts) * 1000
								);
								return (
									<div
										className="flex gap-1 py-2"
										key={`${track.date["#text"]}-${track.mbid}`}
									>
										<div className="flex-1 flex items-center justify-center">
											<img
												src={track.image[2]["#text"]}
												width={20}
												height={20}
												alt="album-cover"
											/>
										</div>
										<div className="flex-[2] flex-col">
											<div>{track.name}</div>
											<div className="text-xs text-grey-300">
												{track.album["#text"]}
											</div>
										</div>
										<div className="flex-1">{track.artist.name}</div>
										<div className="flex-1 text-grey-600">
											{timeSincePlay.dayElapsed > 0
												? `${timeSincePlay.dayElapsed} day${
														timeSincePlay.dayElapsed > 1 ? "s" : ""
												  } ago`
												: timeSincePlay.hourElapsed > 0
												? `${timeSincePlay.hourElapsed} hr${
														timeSincePlay.hourElapsed > 1 ? "s" : ""
												  } ago`
												: `${timeSincePlay.minElapsed} min ${timeSincePlay.secRemainder} sec ago`}
										</div>
									</div>
								);
							})}
						</div>
					</div>
					<div className="flex flex-1">{/** top tracks week */}</div>
				</section>
			</div>
		</div>
	);
};
export default RecentlyListened;
