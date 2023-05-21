import { SuccessResponse } from "./api";

export module LastFm {
	interface attr {
		user: string;
		totalPages: string;
		page: string;
		total: string;
		perPage: string;
	}
	interface Image {
		size: string;
		"#text": string;
	}
	interface Artist {
		image: Image[];
		mbid: string;
		name: string;
		url: string;
	}
	interface Album {
		"#text": string;
		mbid: string;
	}

	interface Base_Track {
		artist: Artist;
		image: Image[];
		mbid: string;
		loved: "0" | "1";
		name: string;
		streamable: "0" | "1";
		url: string;
		album: Album;
	}

	type NowPlaying_Track = Base_Track & {
		"@attr": { nowplaying: "true" };
	};
	type Historical_Track = Base_Track & {
		date: {
			"#text": string;
			uts: string;
		};
	};

	export type Track = NowPlaying_Track | Historical_Track;
	export interface RecentTracks {
		recenttracks: {
			"@attr": attr;
			track: Track[];
		};
	}
}

export interface RecentTracksResponse extends SuccessResponse {
	success: true;
	data: LastFm.RecentTracks;
}
