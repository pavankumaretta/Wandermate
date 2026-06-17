import http from 'node:http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { createApp } from './app.js';
import { config } from './config.js';
import { registerSocketHandlers } from './socket.js';

async function main() {
  await mongoose.connect(config.mongodbUri);
  const app = createApp();
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: config.clientOrigin } });
  registerSocketHandlers(io);

  server.listen(config.port, () => {
    console.log(`Wandermate API listening on http://localhost:${config.port}`);
  });

  const shutdown = async () => {
    io.close();
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((error) => {
  console.error('Startup failed', error);
  process.exit(1);
});
