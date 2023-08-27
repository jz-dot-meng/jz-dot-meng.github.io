import { errorParseToString } from "@utils/functions/object";
import { ErrorResponse } from "@utils/types/api";
import { WeeklyArtistReponse, WeeklyTrackReponse } from "@utils/types/music";
import corsWrapper from "@utils/wrappers/cors";
import { NextApiRequest, NextApiResponse } from "next";

const getWeekTop = async (type: string): Promise<WeeklyTrackReponse | WeeklyArtistReponse> => {
    switch (type) {
        case "tracks": {
            const resp = await fetch(
                `https://ws.audioscrobbler.com/2.0/?method=user.getweeklytrackchart&user=mengbeats&api_key=${process.env.LAST_FM_API_KEY}&format=json`
            );
            const data = await resp.json();
            console.log(data);
            return { success: true, data };
        }
        case "artists": {
            const resp = await fetch(
                `https://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart&user=mengbeats&api_key=${process.env.LAST_FM_API_KEY}&format=json`
            );
            const data = await resp.json();
            console.log(data);
            return { success: true, data };
        }
        default: {
            throw "Invalid 'type' param - currently only supports tracks and artists";
        }
    }
};

export default corsWrapper(
    async (
        req: NextApiRequest,
        res: NextApiResponse<WeeklyTrackReponse | WeeklyArtistReponse | ErrorResponse>
    ) => {
        try {
            const { type } = req.query;
            if (typeof type !== "string") {
                return res
                    .status(500)
                    .json({ success: false, error: "Bad 'type' param - must be string" });
            }
            const data = await getWeekTop(type);
            return res.status(200).json(data);
        } catch (err: unknown) {
            const error = errorParseToString(err);
            return res.status(500).json({ success: false, error });
        }
    }
);
