import { validateToken } from "data-cache";
import { NextApiRequest } from "next";

export const validateABNFRequest = (req: NextApiRequest) => {
    const parsed = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    console.log(parsed);
    const { mode, address, token } = parsed;
    if (!mode) throw new Error("No chain mode provided");
    if (!address) throw new Error("No address provided");
    if (!token) throw new Error("No token provided");
    const chain = mode;
    const validatedTokenData = validateToken(chain, address, token);
    return validatedTokenData;
};
