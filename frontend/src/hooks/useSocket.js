// frontend/src/hooks/useSocket.js
import { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [socketStatus, setSocketStatus] = useState('Connecting...');
  const [isGenerating, setIsGenerating] = useState(false);
  const [cached, setCached] = useState(false);
  const [generationStatus, setGenerationStatus] = useState(null); // 'generating' | 'complete' | 'cached' | 'fallback' | 'error'
  const [lastTrigger, setLastTrigger] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    const socket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 10000
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connected, ID:', socket.id);
      setIsConnected(true);
      setSocketStatus('Connected');
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
      setSocketStatus('Disconnected');
      setIsGenerating(false);
    });

    socket.on('connect_error', (err) => {
      console.error('⚠️ Socket connection error:', err.message);
      setIsConnected(false);
      setSocketStatus('Connection Error');
      setIsGenerating(false);
    });

    // Latency UX feedback: Generation started in backend
    socket.on('AURAGEN_STATUS', (data) => {
      console.log('⚡ AuraGen status update:', data);
      if (data?.status === 'generating') {
        setIsGenerating(true);
        setGenerationStatus('generating');
      }
    });

    // Listen for AuraGen Trigger event from backend
    socket.on('AURAGEN_TRIGGERED', (data) => {
      console.log('⚡ AuraGen triggered payload:', data);
      setIsGenerating(false);
      const isCached = !!data.cached;
      setCached(isCached);
      setGenerationStatus(data.status || (isCached ? 'cached' : 'complete'));
      setLastTrigger({
        ...data,
        timestamp: new Date().toLocaleTimeString()
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const emitEvent = useCallback((eventName, payload) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(eventName, payload);
    } else {
      console.warn('⚠️ Socket not connected, could not emit:', eventName);
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    socketStatus,
    isGenerating,
    setIsGenerating,
    cached,
    setCached,
    generationStatus,
    setGenerationStatus,
    lastTrigger,
    setLastTrigger,
    emitEvent
  };
}
