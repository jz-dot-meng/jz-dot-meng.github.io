import { Carousel, CarouselRef } from "@components/common/carousel/Carousel";
import { LastFm } from "@utils/types/music";
import { useMusicContext } from "context/MusicContext";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface CombinedTrackData {
	track: LastFm.Track;
	rank: LastFm.Track_Rank;
}

export const WeeklyTop: React.FunctionComponent = () => {
	const { weeklyTracks, weeklyArtists, latestTracks } = useMusicContext();

	// last fm's weekly tracks is missing a whole bunch of metadata
	const [remappedTopTracks, setRemappedTopTracks] = useState<CombinedTrackData[]>([]);
	useEffect(() => {
		const top: CombinedTrackData[] = [];
		let count = 0;
		while (top.length < 4 && count < weeklyTracks.length) {
			const ranked = weeklyTracks[count];
			const match = latestTracks.find(
				(track) =>
					track.name === ranked.name && track.artist.name === ranked.artist["#text"]
			);
			if (match) {
				top.push({
					track: match,
					rank: ranked,
				});
			}
			count++;
		}
		setRemappedTopTracks(top);
	}, [weeklyTracks, latestTracks]);

	const carouselRef1 = useRef<CarouselRef>(null);
	const carouselRef2 = useRef<CarouselRef>(null);

	const prev = () => {
		carouselRef1.current?.prev();
		carouselRef2.current?.prev();
	};
	const next = () => {
		carouselRef1.current?.next();
		carouselRef2.current?.next();
	};

	return (
		<div className="flex flex-col flex-1 gap-2 overflow-hidden">
			<div className="flex border-b border-white p-2 text-sm">
				<div className="pl-2 pr-4 cursor-pointer" onClick={() => prev()}>
					&lt;
				</div>
				<div className="flex-1 px-4">
					<Carousel itemsToShow={1} childrenLength={2} ref={carouselRef1}>
						<div className="flex-1 text-right">Top Tracks of the Week</div>
						<div className="flex-1 text-right">Top Artists of the Week</div>
					</Carousel>
				</div>
				<div className="pl-4 pr-2 cursor-pointer" onClick={() => next()}>
					&gt;
				</div>
			</div>
			<div className="flex flex-1 items-center overflow-hidden">
				<Carousel itemsToShow={1} childrenLength={2} ref={carouselRef2}>
					<div className="grid grid-rows-2 grid-cols-2 gap-2 flex-1">
						{remappedTopTracks.map((data, index) => (
							<Link
								className="relative group"
								key={`${index}-${data.track.mbid}`}
								href={data.track.url}
								target="_blank"
							>
								<img
									src={data.track.image[2]["#text"]}
									width={"100%"}
									height={"100%"}
									className="group-hover:opacity-50"
								/>
								<div className="hidden absolute group-hover:flex top-0 right-0 text-xs text-grey-800 bg-grey-300 p-1">
									Played: {data.rank.playcount} times in the last week
								</div>
								<div className="absolute bottom-0 right-0 flex flex-col p-2 w-full bg-grey-300/90 group-hover:underline group-hover:decoration-coral-400">
									<div>{data.track.name}</div>
									<div className="text-xs text-white">
										{data.track.artist.name}
									</div>
								</div>
							</Link>
						))}
					</div>
					<div className="flex overflow-y-scroll h-full no-scrollbar flex-1">
						<div className="flex flex-col gap-1 w-full">
							{weeklyArtists.map((data, index) => (
								<div
									className="flex w-full p-2 gap-4 items-center"
									key={`${index}-${data.name}`}
								>
									<div className="w-6">{index + 1}.</div>
									<Link
										className="flex w-full items-center"
										key={index}
										href={data.url}
										target="_blank"
									>
										<div className="flex-1">{data.name}</div>
										<div className="flex-1 text-xs text-white text-right">
											played {data.playcount} times
										</div>
									</Link>
								</div>
							))}
						</div>
					</div>
				</Carousel>
			</div>
		</div>
	);
};
