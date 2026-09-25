// backend/src/server.js
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import healthRoutes from './routes/health.js';
import { initSocketHandlers } from './websocket/socketHandlers.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Health route
app.use('/health', healthRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: false
  },
  transports: ['websocket', 'polling']
});

initSocketHandlers(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Backend + Socket.IO running on http://localhost:${PORT}`);
});