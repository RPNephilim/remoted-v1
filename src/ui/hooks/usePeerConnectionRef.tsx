import { useRef, useEffect } from 'react';
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

  return {
    ...context,
    getContext,
  };
};
