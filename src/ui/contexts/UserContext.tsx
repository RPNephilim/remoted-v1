import { createContext, useContext, useState, type ReactNode } from 'react';

export interface DeviceType {
    deviceName: string;
    lastUsed: string;
    dateAdded: string;
    active: boolean;
}

export interface UserContextType {
    user: {
        username: string;
        email?: string;
        devices: DeviceType[]
    } | null;
    updateUser: (newUser: UserContextType["user"]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    // const [user, setUser] = useState<UserContextType["user"] | null>(null);
    const [user, setUser] = useState<UserContextType["user"] | null>({
        username: 'user1',
        email: 'user1@example.com',
        // devices: []
        devices: [{
            deviceName: 'device1',
            lastUsed: 'Current Device',
            dateAdded: '2026-01-20',
            active: true
        },
        {
            deviceName: 'device2',
            lastUsed: '2026-02-10',
            dateAdded: '2026-01-25',
            active: true
        }]
    });

    const updateUser = (newUser: UserContextType["user"]) => {
        setUser(newUser);
        console.log("Updated user data: " + { newUser })
    }

    return (
        <UserContext.Provider value={{ user, updateUser }}>
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

