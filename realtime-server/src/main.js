import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import Database from './database.js';
import { instrument } from "@socket.io/admin-ui";
import { authenticationMiddleware } from './middleware.js';
import { connectionService } from './connection.js';
import { registerRouters } from './routers.js';
import { EditionRegister } from './register.js';
import { AIService } from './aiservice.js';
import 'dotenv/config';
import cors from 'cors';

const URL = process.env.MONGODB_URL;
const DATABASE_NAME = process.env.DATABASE_NAME;


const app = express();

const corsOptions = {
  origin: '*', 
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(express.json());

const server = createServer(app);

const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    }
});

instrument(io, {
    auth: false,
    mode: "development",
});

const db = new Database(URL, DATABASE_NAME);

const editionRegister = new EditionRegister();

authenticationMiddleware(io, db);

connectionService(io, db, editionRegister);

const aiService = new AIService(editionRegister, io, db);

registerRouters(app, aiService);


server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
