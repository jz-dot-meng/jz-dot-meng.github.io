import { Keypair } from "@solana/web3.js";
import { base58ToUint8Array } from "@utils/functions/encoding";
import { errorParseToString } from "@utils/functions/object";
import { LocalUserManagement } from "@utils/functions/user";
import { makeUserDetailsKey } from "@utils/storage/utils";
import { ErrorResponse } from "@utils/types/api";
import { User, UserRemoteInfoReponse } from "@utils/types/user";
import { api } from "@utils/wrappers/api";
import { Wallet } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";

interface UserOverview {
    user: User | undefined;
}

const UserContext = createContext<UserOverview | null>(null);

export const useUserContext = () => {
    const userContext = useContext(UserContext);
    if (userContext === null) {
        throw new Error("UserContext not defined");
    }
    return userContext;
};

export const UserContextProvider = ({
    children,
}: {
    children: React.ReactElement | React.ReactNode;
}) => {
    const [user, setUser] = useState<User | undefined>(undefined);

    const getCachedUserPrivateKey = () => {
        let userLocalPrivateKey = LocalUserManagement.getUserPrivateKey();
        if (!userLocalPrivateKey) {
            console.log("no pk found, creating new user pk");
            userLocalPrivateKey = LocalUserManagement.createUserPrivateKey("evm");
        }
        console.log("user pk", userLocalPrivateKey);
        return {
            ...user,
            ...userLocalPrivateKey,
        };
    };

    const getCachedOrRemoteUserData = async (partialUser: User): Promise<User> => {
        if (!partialUser) {
            return;
        }
        const address = (() => {
            switch (partialUser.privateKeyType) {
                case "evm":
                    return new Wallet(partialUser.privateKey).address;
                case "svm":
                    return Keypair.fromSecretKey(
                        base58ToUint8Array(partialUser.privateKey)
                    ).publicKey.toBase58();
            }
        })();
        const messageKey = makeUserDetailsKey(address);
        const cachedUserData = LocalUserManagement.getCachedUserRemoteInfo();
        if (cachedUserData) {
            return {
                ...partialUser,
                ...cachedUserData,
            };
        }
        const signedMessage = LocalUserManagement.signMessage(partialUser, {
            statement: messageKey,
        });
        const data = {
            token: signedMessage,
            address,
            mode: partialUser.privateKeyType,
        };
        const response = await api<UserRemoteInfoReponse | ErrorResponse>(
            "/api/user/details",
            data
        ).catch((err) => {
            console.log(err);
            return {
                success: false as const,
                error: errorParseToString(err),
            } as ErrorResponse;
        });
        if (response.success) {
            LocalUserManagement.setUserRemoteInfo(response.data);
            return {
                ...partialUser,
                ...response.data,
            };
        }
        return partialUser;
    };

    const handleGetUserDetailsFlow = async () => {
        const partialUser = getCachedUserPrivateKey();
        const fullUser = await getCachedOrRemoteUserData(partialUser);
        setUser(fullUser);
    };

    // get and validate user on load
    useEffect(() => {
        handleGetUserDetailsFlow();
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
