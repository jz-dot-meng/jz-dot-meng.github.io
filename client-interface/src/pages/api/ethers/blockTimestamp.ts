import { errorParseToString } from "@utils/functions/object";
import { ErrorResponse } from "@utils/types/api";
import { BlockTimestampResponse } from "@utils/types/ethers";
import corsWrapper from "@utils/wrappers/cors";
import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";

const getBlockTimestamp = async (blockNo: string): Promise<{ blockTimestamp: number }> => {
    const url = `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY || ""}`;
    const HTTP_PROVIDER = new ethers.JsonRpcProvider(url);
    console.log("getting timestamp for block", blockNo);
    const blockDetails = await HTTP_PROVIDER.getBlock(`0x${Number(blockNo).toString(16)}`);
    return {
        blockTimestamp: blockDetails.timestamp,
    };
};

export default corsWrapper(
    async (req: NextApiRequest, res: NextApiResponse<BlockTimestampResponse | ErrorResponse>) => {
        try {
            const blockNo = req.query.blockNo;
            if (!blockNo) throw "No block number provided";
            const data = await getBlockTimestamp(blockNo.toString());
            return res.status(200).json({ success: true, data });
        } catch (err: unknown) {
            console.log("error from provider", err);
            const error = errorParseToString(err);
            return res.status(500).json({ success: false, error });
        }
    }
);
