import { createContext, useContext, useState, type ReactNode } from 'react';

interface UserContextType {
    user: {
        username: string;
        email?: string;
        devices: {
            deviceName: string;
            platform: string;
            lastUsed: string;
            dateAdded: string;
            active: boolean
        }[]
    } | null;
    updateUser: (newUser: UserContextType["user"]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: {children: ReactNode}) => {
    const [user, setUser] = useState<UserContextType["user"] | null>(null);

    const updateUser = (newUser: UserContextType["user"]) => {
        setUser(newUser);
        console.log("Updated user data: "+ {newUser})
    }

    return (
        <UserContext.Provider value={{user, updateUser}}>
            {children}
        </UserContext.Provider>
    )
}

export const getUser = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("getUser must be used within a UserProvider");
    }
    return context;
}

