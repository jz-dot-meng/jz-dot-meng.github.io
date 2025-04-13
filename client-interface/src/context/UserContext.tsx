import { errorParseToString } from "@utils/functions/object";
import {
    extractUserLocalData,
    extractUserRemoteData,
    LocalUserManagement,
} from "@utils/functions/user"; // Re-add extractUserRemoteData
import { makeUserDetailsKey } from "@utils/storage/utils";
import { ErrorResponse } from "@utils/types/api";
import { UserRemoteInfoReponse } from "@utils/types/user";
import { api } from "@utils/wrappers/api";
import { getUserAddress, signMessage, UpdateUserDetailsParams, User } from "data-cache"; // Re-add signMessage import
import { DataCacheFrontend } from "data-cache/frontend"; // Import frontend helper
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
        const token = signMessage(partialUser, {
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
        // Prepare params for the command handler
        const params: UpdateUserDetailsParams = updatedUser;

        // Use the frontend helper to sign the command and get the payload
        const signedPayload = DataCacheFrontend.handleUpdateUser(updatedUser, params);
        console.log("[UserContext] Generated signedPayload:", signedPayload); // <-- Log payload
        const response = await api<UserRemoteInfoReponse | ErrorResponse>(
            "/api/command", // Use the new unified command endpoint
            signedPayload // Send the signed payload directly
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
        // Re-extract remote data *after* successful update to store locally
        const userRemoteData = extractUserRemoteData(updatedUser);
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
