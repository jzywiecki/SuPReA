import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import Database from './database.js';
import { instrument } from "@socket.io/admin-ui";
import { authenticationMiddleware } from './middleware.js';
import { connectionService } from './connection.js';
import { registerRouters } from './routers.js';
import { EditionRegister } from './edition.js';


const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
      origin: ["*"],
      credentials: true
    }
  });

instrument(io, {
    auth: false,
    mode: "development",
});

const db = new Database();

const editionRegister = new EditionRegister();

authenticationMiddleware(io, db);

connectionService(io, db, editionRegister);

registerRouters(app);

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
