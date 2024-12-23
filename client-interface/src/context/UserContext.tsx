import { errorParseToString } from "@utils/functions/object";
import {
    extractUserLocalData,
    extractUserRemoteData,
    getUserAddress,
    LocalUserManagement,
} from "@utils/functions/user";
import { makeUserDetailsKey, makeUserDetailsKeyWithWriteData } from "@utils/storage/utils";
import { ErrorResponse } from "@utils/types/api";
import { User, UserRemoteInfoReponse } from "@utils/types/user";
import { api } from "@utils/wrappers/api";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface UserOverview {
    user: User | undefined;
    updateUser: (updatedUser: User) => Promise<void>;
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
        let userLocalPrivateKey = LocalUserManagement.getCachedUserLocalInfo();
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
        const address = getUserAddress(partialUser);
        const messageKey = makeUserDetailsKey(address);
        const cachedUserData = LocalUserManagement.getCachedUserRemoteInfo();
        if (cachedUserData) {
            return {
                ...partialUser,
                ...cachedUserData,
            };
        }
        const token = LocalUserManagement.signMessage(partialUser, {
            statement: messageKey,
        });
        const data = {
            token,
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

    const updateUser = async (updatedUser: User) => {
        const address = getUserAddress(updatedUser);
        // change remote cache first
        const userRemoteData = extractUserRemoteData(updatedUser);
        const statement = makeUserDetailsKeyWithWriteData(address, userRemoteData.data);
        const token = LocalUserManagement.signMessage(updatedUser, {
            statement,
        });
        const data = {
            token,
            address,
            mode: updatedUser.privateKeyType,
        };
        const response = await api<UserRemoteInfoReponse | ErrorResponse>(
            "/api/user/update",
            data
        ).catch((err) => {
            console.log(err);
            return {
                success: false as const,
                error: errorParseToString(err),
            } as ErrorResponse;
        });
        if (response.success === false) {
            toast.error(`Unable to update profile: ${response.error}`);
            return;
        }
        // store in local storage next
        const userLocalData = extractUserLocalData(updatedUser);
        LocalUserManagement.setUserLocalInfo(userLocalData);
        LocalUserManagement.setUserRemoteInfo(userRemoteData.data);
        // store in state
        setUser(updatedUser);
    };

    // get and validate user on load
    useEffect(() => {
        handleGetUserDetailsFlow();
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                updateUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
