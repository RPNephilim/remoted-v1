import { createContext, useContext, useState, type ReactNode } from 'react';

export interface PeerConnectionContextType {
    userId: string;
    peerId: string;
    connectionMode: string;
    serverConnection: WebSocket | null;
    peerConnection: RTCPeerConnection | null;
    setUserId: (id: string) => void;
    setPeerId: (id: string) => void;
    setConnectionMode: (mode: string) => void;
    setServerConnection: (connection: WebSocket | null) => void;
    setPeerConnection: (connection: RTCPeerConnection | null) => void;
}

const PeerConnectionContext = createContext<PeerConnectionContextType | undefined>(undefined);

export const PeerConnectionProvider = ({ children }: { children: ReactNode }) => {
    const [userId, setUserId] = useState<string>('');
    const [peerId, setPeerId] = useState<string>('');
    const [connectionMode, setConnectionMode] = useState<string>('');
    const [serverConnection, setServerConnection] = useState<WebSocket | null>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);

    return (
        <PeerConnectionContext.Provider value={{ userId, peerId, connectionMode, serverConnection, peerConnection, setUserId, setPeerId, setConnectionMode, setServerConnection, setPeerConnection }}>
            {children}
        </PeerConnectionContext.Provider>
    )
}

export const getPeerConnection = () => {
    const context = useContext(PeerConnectionContext);

    if (!context) {
        throw new Error("getPeerConnection must be used within a PeerConnectionProvider");
    }
    return context;
}