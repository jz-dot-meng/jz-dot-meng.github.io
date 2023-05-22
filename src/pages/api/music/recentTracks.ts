import { ErrorResponse } from "@utils/types/api";
import { LastFm, RecentTracksResponse } from "@utils/types/music";
import corsWrapper from "@utils/wrappers/cors";
import { NextApiRequest, NextApiResponse } from "next";

const getRecentTracks = async (): Promise<LastFm.RecentTracks> => {
	const resp = await fetch(
		`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=mengbeats&api_key=${process.env.LAST_FM_API_KEY}&format=json&extended=1&limit=100`
	);
	const data = await resp.json();
	// console.log(data);
	return data;
};

export default corsWrapper(
	async (req: NextApiRequest, res: NextApiResponse<RecentTracksResponse | ErrorResponse>) => {
		try {
			const data = await getRecentTracks();
			return res.status(200).json({ success: true, data });
		} catch (err: any) {
			const error = err.message ? err.message : JSON.stringify(err);
			return res.status(500).json({ success: false, error });
		}
	}
);
