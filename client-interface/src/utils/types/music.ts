import { SuccessResponse } from "./api";

export namespace LastFm {
    interface attr_tracks {
        user: string;
        totalPages: string;
        page: string;
        total: string;
        perPage: string;
    }
    interface attr_weekly {
        user: string;
        from: string;
        to: string;
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
    interface Artist_short {
        mbid: string;
        "#text": string;
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
    export interface Track_Rank {
        "@attr": { rank: string };
        artist: Artist_short;
        image: Image[];
        mbid: string;
        name: string;
        playcount: string;
        url: string;
    }
    export interface Artist_Rank {
        "@attr": { rank: string };
        mbid: string;
        name: string;
        playcount: string;
        url: string;
    }
    export interface RecentTracks {
        recenttracks: {
            "@attr": attr_tracks;
            track: Track[];
        };
    }

    export interface WeeklyTracks {
        weeklytrackchart: {
            "@attr": attr_weekly;
            track: Track_Rank[];
        };
    }

    export interface WeeklyArtists {
        weeklyartistchart: {
            "@attr": attr_weekly;
            artist: Artist_Rank[];
        };
    }
}

export interface RecentTracksResponse extends SuccessResponse {
    success: true;
    data: LastFm.RecentTracks;
}

export interface WeeklyTrackReponse extends SuccessResponse {
    success: true;
    data: LastFm.WeeklyTracks;
}

export interface WeeklyArtistReponse extends SuccessResponse {
    success: true;
    data: LastFm.WeeklyArtists;
}
