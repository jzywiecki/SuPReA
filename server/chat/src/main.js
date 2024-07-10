import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import Database from './database.js';
import { ObjectId } from 'mongodb';
import { instrument } from "@socket.io/admin-ui";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
      origin: ["https://admin.socket.io"],
      credentials: true
    }
  });

instrument(io, {
    auth: false,
    mode: "development",
});

const db = new Database();

  
io.use(async (socket, next) => {
    console.log("[INFO] Running adapter.")
    const token = socket.handshake.auth.token;
    const userId = socket.handshake.auth.userId;
    const projectId = socket.handshake.auth.projectId;
  
    try {
        if (!token || typeof token !== 'string' || !token.trim() ||
        !userId || typeof userId !== 'string' || !userId.trim() ||
        !projectId || typeof projectId !== 'string' || !projectId.trim()) {
            console.log("[INFO] Rejecting invalid handshake auth parameters.");
            return next(new Error("Invalid handshake auth parameters"));
        }

        //TODO: Check if user is authorized.
        const isMemberPromise = db.isUserProjectMember(
            new ObjectId(projectId), 
            new ObjectId(userId)
        ); 

        const isMember = await isMemberPromise;
        const isAuthorized = true;

        if (!isAuthorized) {
            console.log("[INFO] Rejecting unauthorized user.")
            next(new Error("User is not authorized"));
        }
        else if (!isMember) {
            console.log("[INFO] Rejecting user that is not a member of the project.")
            next(new Error("User is not a member of the project"));
        }
        else {
            socket.userId = userId;
            socket.projectId = projectId;
            next();
        }
    }
     catch (error) {
        console.log("[ERROR] Adapter Execution Failure")
        console.log(`[ERROR DETAILS] ${error.message}'`)
        next(new Error("INTERNAL SERVER ERROR."));
    }
});


io.on('connection', async (socket) => {
    console.log('[INFO] User connected');
    console.log(`[INFO] socket id: ${socket.id}`);
    console.log(`[INFO] user id: ${socket.userId}`);

    const projectId = new ObjectId(socket.projectId);
    const userId = new ObjectId(socket.userId);

    let discussionChatId;
    let aiChatId;
    try {
        discussionChatId = await db.getGeneralChatIdFromProject(projectId);
        aiChatId      = await db.getAiChatIdFromProject(projectId);
        
        if (!discussionChatId || !aiChatId) {
            throw new Error('Chat does not exist.');
        }
    } catch (error) {
        console.log(`[ERROR] Cannot get chats from project ${socket.projectId}.`);
        console.log(`[ERROR DETAILS] ${error.message}`);
        socket.emit('error', 'INTERNAL SERVER ERROR');
        socket.disconnect();
    }

    retransmitLostData(socket, discussionChatId, aiChatId);

    socket.join(socket.projectId);

    socket.onAny(async (eventName, ...args) => {
        try {
            // check if user is still a member of the project
            const isMember = await db.isUserProjectMember(projectId, userId);

            if (!isMember) {
                console.log("[INFO] Disconnect user which is not a member of the project now.")
                socket.disconnect();
            }
        } catch (error) {
            console.log(`[ERROR] Cannot check if user is a member of the project.`);
            console.log(`[ERROR DETAILS] ${error.message}`);
            socket.emit('error', 'INTERNAL SERVER ERROR');
            socket.disconnect();
        }
    });


    async function handleSendMessage(socket, chatId, text, eventToEmit) {
        if (!text || typeof text !== 'string' || text.length > 1000) {
            socket.emit('error', 'Invalid message format.');
            return;
        }

        try {
            const message = await db.addMessage(projectId, chatId, text, userId);
            if (!message) {
                throw new Error('Message not added.');
            }

            io.to(socket.projectId).emit(eventToEmit, message);
            
        } catch (error) {
            console.log(`[ERROR] Cannot add message to chat ${chatId}.`);
            console.log(`[ERROR DETAILS] ${error.message}`);
            socket.emit('error', 'INTERNAL SERVER ERROR');
            socket.disconnect();
        }
    }


    socket.on('send-message-to-discussion-chat', (text) => {
        handleSendMessage(socket, discussionChatId, text, 'receive-message-from-discussion-chat');
    });


    socket.on('send-message-to-ai-chat', (text) => {
        handleSendMessage(socket, aiChatId, text, 'receive-message-from-ai-chat');
    });


    async function handleGetOlderMessages(socket, chatId, lastMessageId, eventToEmit) {
        if (!lastMessageId || typeof lastMessageId !== 'number' || lastMessageId < 0) {
            console.log("[INFO] User requested older messages with wrong last message id.")
            socket.emit('error', 'Invalid parameters');
            return;
        }
    
        try {
            const messages = await db.getOlderMessages(chatId, lastMessageId, 10);
            socket.emit(eventToEmit, messages);
        } catch (error) {
            console.log(`[ERROR] Cannot get older messages from chat ${chatId}.`)
            console.log(`[ERROR DETAILS] ${error.message}`);
            socket.emit('error', 'INTERNAL SERVER ERROR');
            socket.disconnect();
        }
    }


    socket.on('get-older-messages-from-general-chat', (lastMessageId) => {
        handleGetOlderMessages(socket, discussionChatId, lastMessageId, 'receive-older-messages-from-general-chat');
    });


    socket.on('get-older-messages-from-ai-chat', (lastMessageId) => {
        handleGetOlderMessages(socket, aiChatId, lastMessageId, 'receive-older-messages-from-ai-chat');
    });


    socket.on('disconnect', () => {
        console.log(`[INFO] User disconnected`);
        console.log(`[INFO] socket id: ${socket.id}`);
    });
});


io.on('connect_error', (error) => {
    console.log(`[ERROR] ${error.message}`);
});


const retransmitLostData = async (socket, discussionChatId, aiChatId) => {
    try {
        const discussionChatOffset = socket.handshake.auth.discussionChatOffset || 0;
        const aiChatOffset = socket.handshake.auth.aiChatOffset || 0;
    

        if (discussionChatOffset > 0) {
            const messages = await db.getNewerMessages(discussionChatId, discussionChatOffset);
            socket.emit('receive-message-from-discussion-chat', messages);
        }
        else {
            const messages = await db.getNewestMessages(discussionChatId, 15);
            socket.emit('receive-message-from-discussion-chat', messages);
        }

        if (aiChatOffset > 0) {
            const messages = await db.getNewerMessages(aiChatId, aiChatOffset);
            socket.emit('receive-message-from-ai-chat', messages);
        }
        else {
            const messages = await db.getNewestMessages(aiChatId, 15);
            socket.emit('receive-message-from-ai-chat', messages);
        }
    } catch (error) {
        console.log(`[ERROR] Cannot retransmit lost data.`);
        console.log(`[ERROR DETAILS] ${error.message}`);
        socket.emit('error', 'INTERNAL SERVER ERROR.');
        socket.disconnect();
    }
};


server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});