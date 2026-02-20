import { useRef, useEffect, useCallback } from 'react';
import { usePeerConnection } from '../contexts/PeerConnectionContext';

/**
 * Custom hook that provides always-current peer connection context values
 * Use this when you need to access context values in callbacks without stale closures
 */
export const usePeerConnectionRef = () => {
  const context = usePeerConnection();
  const contextRef = useRef(context);

  // Keep the ref updated with latest context values
  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  // Return a function that always gets the current context
  const getContext = () => contextRef.current;

  // Wrap setters to update ref immediately
  const setUserId = useCallback((value: string) => {
    contextRef.current = { ...contextRef.current, userId: value };
    context.setUserId(value);
  }, [context]);

  const setPeerId = useCallback((value: string) => {
    contextRef.current = { ...contextRef.current, peerId: value };
    context.setPeerId(value);
  }, [context]);

  const setConnectionMode = useCallback((value: string) => {
    contextRef.current = { ...contextRef.current, connectionMode: value };
    context.setConnectionMode(value);
  }, [context]);

  const setServerConnection = useCallback((value: WebSocket | null) => {
    contextRef.current = { ...contextRef.current, serverConnection: value };
    context.setServerConnection(value);
  }, [context]);

  const setPeerConnection = useCallback((value: RTCPeerConnection | null) => {
    contextRef.current = { ...contextRef.current, peerConnection: value };
    context.setPeerConnection(value);
  }, [context]);

  const setDataChannel = useCallback((value: RTCDataChannel | null) => {
    contextRef.current = { ...contextRef.current, dataChannel: value };
    context.setDataChannel(value);
  }, [context]);

  const setLocalStream = useCallback((value: MediaStream | null) => {
    contextRef.current = { ...contextRef.current, localStream: value };
    context.setLocalStream(value);
  }, [context]);

  const setRemoteStream = useCallback((value: MediaStream | null) => {
    contextRef.current = { ...contextRef.current, remoteStream: value };
    context.setRemoteStream(value);
  }, [context]);

  return {
    ...context,
    setUserId,
    setPeerId,
    setConnectionMode,
    setServerConnection,
    setPeerConnection,
    setDataChannel,
    setLocalStream,
    setRemoteStream,
    getContext,
  };
};
