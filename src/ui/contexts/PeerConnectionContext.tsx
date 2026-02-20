import { createContext, useContext, useState, type ReactNode } from 'react';

export interface PeerConnectionContextType {
    userId: string;
    peerId: string;
    connectionMode: string;
    castRole: 'caster' | 'receiver' | null;
    serverConnection: WebSocket | null;
    peerConnection: RTCPeerConnection | null;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    dataChannel: RTCDataChannel | null;
    setUserId: (id: string) => void;
    setPeerId: (id: string) => void;
    setConnectionMode: (mode: string) => void;
    setCastRole: (role: 'caster' | 'receiver' | null) => void;
    setServerConnection: (connection: WebSocket | null) => void;
    setPeerConnection: (connection: RTCPeerConnection | null) => void;
    setDataChannel: (channel: RTCDataChannel | null) => void;
    setLocalStream: (stream: MediaStream | null) => void;
    setRemoteStream: (stream: MediaStream | null) => void;

}

const PeerConnectionContext = createContext<PeerConnectionContextType | undefined>(undefined);

export const PeerConnectionProvider = ({ children }: { children: ReactNode }) => {
    const [userId, setUserId] = useState<string>('');
    const [peerId, setPeerId] = useState<string>('');
    const [connectionMode, setConnectionMode] = useState<string>('');
    const [castRole, setCastRole] = useState<'caster' | 'receiver' | null>(null);
    const [serverConnection, setServerConnection] = useState<WebSocket | null>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);

    return (
        <PeerConnectionContext.Provider value={{
            userId, peerId, connectionMode, castRole, serverConnection, peerConnection, localStream, remoteStream, dataChannel,
            setUserId, setPeerId, setConnectionMode, setCastRole, setServerConnection, setPeerConnection, setLocalStream, setRemoteStream, setDataChannel
        }}>
            {children}
        </PeerConnectionContext.Provider>
    )
}

export const usePeerConnection = () => {
    const context = useContext(PeerConnectionContext);
    if (!context) {
        throw new Error("usePeerConnection must be used within a PeerConnectionProvider");
    }
    return context;
}