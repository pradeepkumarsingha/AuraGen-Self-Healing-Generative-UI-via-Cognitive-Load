// backend/src/websocket/socketHandlers.js
import { handleCognitiveLoadHigh } from '../services/cognitiveEventService.js';

export function initSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('COGNITIVE_LOAD_HIGH', (data) => {
      console.log('High cognitive load detected:', data);
      handleCognitiveLoadHigh(io, socket, data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}