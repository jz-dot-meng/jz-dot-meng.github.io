import { PartialABNFMessage } from "@utils/functions/message";
import { errorParseToString } from "@utils/functions/object";
import { isUserRemoteInfoKey, userRemoteKeys } from "@utils/functions/user";
import { DATA_SEPARATOR } from "@utils/storage/constants";
import { makeUserDetailsKey } from "@utils/storage/utils";
import { ErrorResponse } from "@utils/types/api";
import { UserRemoteInfo, UserRemoteInfoReponse } from "@utils/types/user";
import corsWrapper from "@utils/wrappers/cors";
import { validateABNFRequest } from "@utils/wrappers/validation";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { cache } from "../cache";

const handleUpdateUserDetails = async (data: PartialABNFMessage): Promise<UserRemoteInfo> => {
    console.log("received abnf data", data);
    // we've already validated that the address matches the sending address, now we just need to validate it's the correct key
    const addressKey = makeUserDetailsKey(data.address);
    if (!data.statement.startsWith(addressKey)) {
        throw new Error(`Incorrect key, expected ${addressKey}, received ${data.statement}`);
    }
    const maybeData = data.statement.slice(addressKey.length + DATA_SEPARATOR.length);
    const parsedData = JSON.parse(maybeData);
    const validRemoteData: UserRemoteInfo = {};
    for (const key of Object.keys(parsedData)) {
        if (!isUserRemoteInfoKey(key)) continue;
        validRemoteData[key] = parsedData[key].toString();
    }
    if (_.isEmpty(validRemoteData)) {
        throw new Error(
            `no parsed data to upsert for key ${addressKey}, statement received: ${data.statement}`
        );
    }
    // check if name is default
    if (validRemoteData.name === data.address.slice(-5)) {
        // delete all keys
        for (const key of Object.keys(userRemoteKeys)) {
            await cache.hdel(addressKey, key);
        }
    } else {
        await cache.hset(addressKey, validRemoteData);
    }
    return validRemoteData;
};

export default corsWrapper(
    async (req: NextApiRequest, res: NextApiResponse<UserRemoteInfoReponse | ErrorResponse>) => {
        try {
            const requestData = validateABNFRequest(req);
            const data = await handleUpdateUserDetails(requestData);

            return res.status(200).json({ success: true, data });
        } catch (err) {
            console.log(err);
            const error = errorParseToString(err);
            return res.status(500).json({ success: false, error });
        }
    }
);
