import { LocalUserManagement } from "@utils/functions/user";
import { User } from "@utils/types/user";
import { createContext, useContext, useEffect, useState } from "react";

interface UserOverview {
    user: User | undefined;
}

const UserContext = createContext<UserOverview | undefined>(undefined);

export const useUserContext = () => {
    const userContext = useContext(UserContext);
    if (userContext === undefined) {
        throw new Error("UserContext not defined");
    }
    return userContext;
};

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState<User | undefined>(undefined);

    const getCachedUserPrivateKey = () => {
        let userLocalPrivateKey = LocalUserManagement.getUserPrivateKey();
        if (!userLocalPrivateKey) {
            console.log("no pk found, creating new user pk");
            userLocalPrivateKey = LocalUserManagement.createUserPrivateKey("evm");
        }
        console.log("user pk", userLocalPrivateKey);
        setUser({
            ...user,
            ...userLocalPrivateKey,
        });
    };

    // get and validate user on load
    useEffect(() => {
        getCachedUserPrivateKey();
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
