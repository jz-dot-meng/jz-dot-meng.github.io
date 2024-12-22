import { errorParseToString } from "@utils/functions/object";
import { ErrorResponse } from "@utils/types/api";
import { DefiLlama, NearestBlockResponse } from "@utils/types/ethers";
import corsWrapper from "@utils/wrappers/cors";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const getNearestBlock = async (unixTimestamp: string): Promise<DefiLlama.NearestBlock> => {
    console.log("fetching from defiLlama");
    const resp = await axios.get(`https://coins.llama.fi/block/ethereum/${unixTimestamp}`);
    const data = resp.data;
    console.log(data);
    return data;
};

export default corsWrapper(
    async (req: NextApiRequest, res: NextApiResponse<NearestBlockResponse | ErrorResponse>) => {
        try {
            const timestamp = req.query.timestamp;
            if (!timestamp) throw "No timestamp provided";
            const data = await getNearestBlock(timestamp.toString());
            return res.status(200).json({ success: true, data });
        } catch (err: unknown) {
            console.log("error from defi llama", err);
            const error = errorParseToString(err);
            return res.status(500).json({ success: false, error });
        }
    }
);
