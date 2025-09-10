import { createContext, useContext, useState, type ReactNode } from "react";
import type { UserTypes } from "../utils/types";


interface UserContextTypes{
    userData:UserTypes|null;
    setUser:(user:UserTypes)=>void;
    loggedInUserName:()=>string|undefined;
    isUserAdmin:()=>boolean;
    isUserAuthenticated:()=>boolean;
};

const UserContext = createContext<UserContextTypes|null>(null);

export function UserProvider({children}:{children:ReactNode;}) {
    const [userData, setUserData] = useState<UserTypes|null>(null);


    function setUser(user:UserTypes) {
        setUserData(user);
    };

    function loggedInUserName() {
        return userData?.name;
    };
    function isUserAdmin() {
        return userData?.role === "admin";
    };
    function isUserAuthenticated() {
        return userData !== null;
    };

    return(
        <UserContext.Provider value={{userData, setUser, loggedInUserName, isUserAuthenticated, isUserAdmin}}>
            {children}
        </UserContext.Provider>
    )
};

export function useUser() {
    const context = useContext(UserContext);

    if (!context) throw new Error("useUser must be provided inside UserContext");

    return context;
};