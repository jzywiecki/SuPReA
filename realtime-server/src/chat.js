/**
 * This module contains chat serivce logic.
 */

import { logger } from "./utils.js";
import { isMessageValid } from "./utils.js";
import { isNumericIdCorrect } from "./utils.js";
import { DiscussionChatNoOlderMessagesCommunicate } from "./notifications.js";
import { AIChatNoOlderMessagesCommunicate } from "./notifications.js";


export class ProjectChatsReference {
    /**
     * Record of chat ids for project.
     */
    discussionChatId;
    aiChatId;

    constructor(discussionChatId, aiChatId) {
        this.discussionChatId = discussionChatId;
        this.aiChatId = aiChatId;
    }
}


const noOlderMessagesOnDiscussionChat = new DiscussionChatNoOlderMessagesCommunicate();
const noOlderMessagesOnAIChat = new AIChatNoOlderMessagesCommunicate();


export const registerChatEvents = (socket, io, db, session, projectChatsReference) => {
    /**
     * Registers chat events for the given socket.
     * @param {Socket} socket - The socket object handling communication between the server and client.
     * @param {Server} io - The Socket.IO server instance to handle WebSocket connections.
     * @param {Database} db - The database object used to interact with the project's data.
     * @param {Session} session - The user session object containing details like projectId and userId.
     * @param {ProjectChatsReference} projectChatsReference - References to the project's chats, containing properties like discussionChatId and aiChatId.
    */


    const handleGetOlderMessages = async (chatId, oldestReceivedMessageId, reciveOlderMessageEvent, noOlderCommuniate) => {
        /**
         * Handles fetching older messages from a chat and sending them via socket.
         * 
         * @param {ObjectId} chatId - The ID of the chat from which to fetch older messages.
         * @param {number} oldestReceivedMessageId - The ID of the last received message to fetch older ones.
         * @param {string} reciveOlderMessageEvent - The event name used to send older messages to the client.
         * @param {Object} noOlderCommuniate - The message to notify the client when no older messages are available.
         * 
        */
        try {
            if (!isNumericIdCorrect(oldestReceivedMessageId)) {
                logger.info("User requested older messages with wrong last message id.")
                socket.emit('error', 'Invalid id parameter');
                return;
            }
    
            const olderMessagesQuantity = 10;
    
            const messages = await db.getOlderMessages(chatId, oldestReceivedMessageId, olderMessagesQuantity);
            socket.emit(reciveOlderMessageEvent, messages);
            
            if (messages.length < olderMessagesQuantity) {
                socket.emit('notify', noOlderCommuniate);
            }
    
        } catch (error) {
            logger.error(`Cannot get older messages from chat ${chatId}.`)
            logger.error(`Details: ${error.message}`);
            
            socket.emit('error', 'INTERNAL SERVER ERROR');
            socket.disconnect();
        }
    }
    
    
    const handleSendMessageByUser = async (chatId, text, broadcastMessageEvent) => {    
        /**
         * Handles sending a new message in a chat and broadcasting it to all users in the project.
         * 
         * @param {ObjectId} userId - The ID of the user sending the message.
         * @param {ObjectId} chatId - The ID of the chat where the message will be sent.
         * @param {string} text - The content of the message being sent.
         * @param {string} broadcastMessageEvent - The event name used to broadcast the new message.
         * 
         * 
         * @returns {boolean} - Returns true if the message was sent successfully, false if there was an error.
         */
        try {
            if (!isMessageValid(text)) {
                logger.info("User tried to send invalid message.");
                socket.emit('error', 'Invalid message format.');
                return;
            }
    
            const message = await db.addMessage(session.projectId, chatId, text, session.userId);
    
            io.to(session.projectId).emit(broadcastMessageEvent, message);
    
            return true;
    
        } catch (error) {
            logger.error(`Cannot add message to chat ${chatId}.`);
            logger.error(`Details: ${error.message}`);
    
            socket.emit('error', 'INTERNAL SERVER ERROR');
            socket.disconnect();
    
            return false;
        }
    }
    

    socket.on('send-message-to-discussion-chat', (message) => {
        handleSendMessageByUser(socket, session.projectId, session.userId, projectChatsReference.discussionChatId, message, 'receive-message-from-discussion-chat');
    });


    socket.on('send-message-to-ai-chat', (message) => {
        handleSendMessageByUser(socket, session.projectId, session.userId, projectChatsReference.aiChatId, message, 'receive-message-from-ai-chat');
    }); 


    socket.on('get-older-messages-from-discussion-chat', (oldestReceivedMessageId) => {
        handleGetOlderMessages(
            socket, 
            session.discussionChatId, 
            oldestReceivedMessageId, 
            'receive-message-from-discussion-chat',
            noOlderMessagesOnDiscussionChat
        );
    });


    socket.on('get-older-messages-from-ai-chat', (oldestReceivedMessageId) => {
        handleGetOlderMessages(
            socket, 
            session.aiChatId, 
            oldestReceivedMessageId, 
            'receive-message-from-ai-chat',
            noOlderMessagesOnAIChat
        );
    });
}


export const transmitMessagesOnConnection = async (socket, projectChatsReference) => {
    /**
     * Transmits chat messages to the client upon connection or reconnection.
     * @param {Socket} socket - The socket object handling communication between the server and client.
     * @param {ProjectChatsReference} projectChatsReference - Object containing references to the project's chat IDs (discussionChatId and aiChatId).
     * 
     * The function handles the following:
     * - For initial connections: Sends the newest messages up to a fixed quantity for both the discussion and AI chat.
     * - For reconnections: Sends messages that were missed during the disconnection period.
     * 
     * @throws Will log an error and disconnect the socket in case of failure.
    */
    const initConnectionMessageQuantity = 15;

    try {        
        const getMessagesForChat = async (chatId, chatOffset, receiveMessagesEvent, noOlderCommuniate) => {
            if (chatOffset > 0) { 
                /** reconnection case */ 
                const messages = await db.getNewerMessages(chatId, chatOffset);
                socket.emit(receiveMessagesEvent, messages);
            } else { 
                /** initial connection case */ 
                const messages = await db.getNewestMessages(chatId, initConnectionMessageQuantity);
                socket.emit(receiveMessagesEvent, messages);

                if (messages.length < initConnectionMessageQuantity) {
                    socket.emit('notify', noOlderCommuniate);
                }
            }
        };

        const discussionChatOffset = socket?.handshake?.auth?.discussionChatOffset || 0;
        const aiChatOffset = socket?.handshake?.auth?.aiChatOffset || 0;

        // Handle discussion chat
        await getMessagesForChat(projectChatsReference?.discussionChatId, discussionChatOffset, 'receive-message-from-discussion-chat', noOlderMessagesOnDiscussionChat);

        // Handle AI chat
        await getMessagesForChat(projectChatsReference?.aiChatId, aiChatOffset, 'receive-message-from-ai-chat', noOlderMessagesOnAIChat);

    } catch (error) {
        logger.error(`Cannot retransmit lost data.`);
        logger.error(`Details: ${error.message}`);

        socket.emit('error', 'INTERNAL SERVER ERROR');
        socket.disconnect();
    }
};


export const sendMessageByAI = async (io, db, projectId, chatId, aiId, text, broadcastMessageEvent) => {
    /**
     * Sends a message generated by the AI to ai chat.
     * 
     * @param {Object} io - The Socket.IO server instance to emit events to connected clients.
     * @param {Object} db - The database instance for interacting with message storage.
     * @param {ObjectId} projectId - The ID of the project to which the message belongs.
     * @param {ObjectId} chatId - The ID of the chat where the message will be sent.
     * @param {ObjectId} aiId - The ID of the AI sending the message.
     * @param {string} text - The content of the message to be sent.
     * @param {string} broadcastMessageEvent - The event name to broadcast the message to all users.
     * 
    */

    try {
        const message = await db.addMessage(projectId, chatId, text, aiId);

        io.to(socket.projectId).emit(broadcastMessageEvent, message);
    } catch (error) {
        logger.error(`Unexpected Error ${chatId}.`);
    }
}
