import { Identicon } from "@utils/functions/identicon";
import { PartialABNFMessage } from "@utils/functions/message";
import { errorParseToString } from "@utils/functions/object";
import { makeUserDetailsKey } from "@utils/storage/utils";
import { ErrorResponse } from "@utils/types/api";
import { UserRemoteInfo, UserRemoteInfoReponse } from "@utils/types/user";
import corsWrapper from "@utils/wrappers/cors";
import { validateABNFRequest } from "@utils/wrappers/validation";
import { NextApiRequest, NextApiResponse } from "next";
import { cache } from "../cache";

const handleGetUserDetails = async (data: PartialABNFMessage): Promise<UserRemoteInfo> => {
    console.log("received abnf data", data);
    // we've already validated that the address matches the sending address, now we just need to validate it's the correct key
    const check = makeUserDetailsKey(data.address);
    if (check !== data.statement) {
        throw new Error(`Incorrect key, expected ${check}, received ${data.statement}`);
    }
    console.log(`getting hash for key ${data.statement}`);
    const match = await cache.hgetall(data.statement).catch((err) => {
        console.error({ msg: `failed to hgetall for key ${data.statement}`, err });
    });
    console.log(`received hash for key ${data.statement}`);
    const response: UserRemoteInfo = {
        name: data.address.slice(-5),
        pfp: `data:image/svg+xml;base64,${new Identicon(data.address).toString()}`,
    };

    for (const [key, value] of Object.entries(match || {})) {
        switch (key) {
            case "name": {
                response.name = value.toString();
                break;
            }
            case "pfp": {
                response.pfp = value.toString();
                break;
            }
        }
    }

    return response;
};

export default corsWrapper(
    async (req: NextApiRequest, res: NextApiResponse<UserRemoteInfoReponse | ErrorResponse>) => {
        try {
            const requestData = validateABNFRequest(req);
            const data = await handleGetUserDetails(requestData);

            return res.status(200).json({ success: true, data });
        } catch (err) {
            console.log(err);
            const error = errorParseToString(err);
            return res.status(500).json({ success: false, error });
        }
    }
);
