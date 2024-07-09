import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import Database from './database.js';

const app = express();
const server = createServer(app);
const io = new Server(server);


const db = new Database();

  
io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    const userId = socket.handshake.auth.userId;
    const projectId = socket.handshake.auth.projectId;
  
    try {
        if (!token || !userId || !projectId) {
            next(new Error("Invalid parameters"));
        }

        //TODO: Check if user is authorized.
        const isMemberPromise = db.isUserProjectMember(projectId, userId); 

        const isMember = await isMemberPromise;
        const isAuthorized = true;

        if (!isAuthorized) {
            next(new Error("User is not authorized"));
        }
        else if (!isMember) {
            next(new Error("User is not a member of the project"));
        }
        else {
            socket.userId = userId;
            socket.projectId = projectId;
            next();
        }
    }
     catch (error) {
        next(new Error("INTERNAL SERVER ERROR."));
    }
});


io.on('connection', (socket) => {
    console.log('[INFO] User connected');
    console.log(`[INFO] socket id: ${socket.id}`);
    console.log(`[INFO] user id: ${socket.handshake.userId}`);

    let generalChatId;
    let aiChatId;
    try {
        generalChatId = db.getGeneralChatIdFromProject(socket.projectId);
        aiChatId      = db.getAiChatIdFromProject(socket.projectId);
        
        if (!generalChatId || !aiChatId) {
            throw new Error('Chat does not exist.');
        }
    } catch (error) {
        socket.emit('error', 'INTERNAL SERVER ERROR.');
        socket.disconnect();
    }

    retransmitLostData(socket);

    socket.join(socket.projectId);

    socket.onAny(async (eventName, ...args) => {
        try {
            // check if user is still a member of the project
            const isMember = await db.isUserIsProjectMember(socket.projectId, socket.userId);

            if (!isMember) {
                socket.emit('error', 'User is not a member of the project.');
                socket.disconnect();
            }
        } catch (error) {
            socket.emit('error', 'INTERNAL SERVER ERROR.');
            socket.disconnect();
        }
    });


    async function handleSendMessage(socket, chatId, text, eventToEmit) {
        if (!text) {
            socket.emit('error', 'Invalid message format.');
            return;
        }

        const message = {
            "author": socket.userId,
            "text": text,
            "date": new Date()
        };
    
        try {
            await db.addMessage(chatId, message);
            io.to(projectId).emit(eventToEmit, message);
        } catch (error) {
            socket.emit('error', 'INTERNAL SERVER ERROR.');
            socket.disconnect();
        }
    }


    socket.on('send-message-to-general-chat', (text) => {
        handleSendMessage(socket, generalChatId, text, 'receive-message-from-general-chat');
    });


    socket.on('send-message-to-ai-chat', (text) => {
        handleSendMessage(socket, aiChatId, text, 'receive-message-from-ai-chat');
    });


    async function handleGetOlderMessages(socket, chatId, lastMessageId, eventToEmit) {
        if (!lastMessageId) {
            socket.emit('error', 'Invalid parameters');
            return;
        }
    
        try {
            const messages = await db.getOlderMessages(chatId, lastMessageId, 10);
            socket.emit(eventToEmit, messages);
        } catch (error) {
            socket.emit('error', 'INTERNAL SERVER ERROR.');
            socket.disconnect();
        }
    }


    socket.on('get-older-messages-from-general-chat', (lastMessageId) => {
        handleGetOlderMessages(socket, generalChatId, lastMessageId, 'receive-older-messages-from-general-chat');
    });


    socket.on('get-older-messages-from-ai-chat', (lastMessageId) => {
        handleGetOlderMessages(socket, aiChatId, lastMessageId, 'receive-older-messages-from-ai-chat');
    });


    socket.on('disconnect', () => {
        console.log(`[INFO] User disconnected`);
        console.log(`[INFO] socket id: ${socket.id}`);
        console.log(`[INFO] user id: ${socket.handshake.userId}`)
    });
});


io.on('connect_error', (error) => {
    console.log(`[ERROR] ${error.message}`);
});


const retransmitLostData = async (socket) => {
    try {
        const chatOffset = socket.handshake.auth.chatOffset || 0;
        const aiChatOffset = socket.handshake.auth.aiChatOffset || 0;
    

        if (chatOffset > 0) {
            const messages = db.getNewerMessages(chatId, chatOffset);
            socket.emit('message', messages);
        }
        else {
            const messages = db.getNewestMessages(chatId, 15);
            socket.emit('message', messages);
        }

        if (aiChatOffset > 0) {
            const messages = db.getNewerMessages(aiChatId, aiChatOffset);
            socket.emit('message', messages);
        }
        else {
            const messages = db.getNewestMessages(aiChatId, 15);
            socket.emit('message', messages);
        }
    } catch (error) {
        socket.emit('error', 'INTERNAL SERVER ERROR.');
        socket.disconnect();
    }
};


server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});