// frontend/hooks/useSocket.js
import { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [socketStatus, setSocketStatus] = useState('Connecting...');
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
    });

    socket.on('connect_error', (err) => {
      console.error('⚠️ Socket connection error:', err.message);
      setIsConnected(false);
      setSocketStatus('Connection Error');
    });

    // Listen for AuraGen Trigger event from backend
    socket.on('AURAGEN_TRIGGERED', (data) => {
      console.log('⚡ AuraGen triggered:', data);
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
    lastTrigger,
    setLastTrigger,
    emitEvent
  };
}
