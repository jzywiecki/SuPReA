/**
 * This module contains chat serivce logic.
 */

import { logger } from "./utils.js";
import { isMessageValid } from "./utils.js";
import { isNumericIdCorrect } from "./utils.js";
import { serveUserMessageToAI } from './aiforward.js';

import { 
    InvalidArgumentException,
    SessionIsNotRegisteredException,
    UnsupportedRequestTypeException
} from './exceptions.js'

import { ObjectId } from "mongodb";
import 'dotenv/config';


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


export const registerChatEvents = (socket, io, db, session, projectChatsReference, editionRegister) => {
    /**
     * Registers chat events for the given socket.
     * @param {Socket} socket - The socket object handling communication between the server and client.
     * @param {Server} io - The Socket.IO server instance to handle WebSocket connections.
     * @param {Database} db - The database object used to interact with the project's data.
     * @param {Session} session - The user session object containing details like projectId and userId.
     * @param {ProjectChatsReference} projectChatsReference - References to the project's chats, containing properties like discussionChatId and aiChatId.
     * @param {EditionRegister} editionRegister - The register object containing the edition status of the project.
    */


    const handleGetOlderMessages = async (chatId, oldestReceivedMessageId, reciveOlderMessageEvent) => {
        /**
         * Handles fetching older messages from a chat and sending them via socket.
         * 
         * @param {ObjectId} chatId - The ID of the chat from which to fetch older messages.
         * @param {number} oldestReceivedMessageId - The ID of the last received message to fetch older ones.
         * @param {string} reciveOlderMessageEvent - The event name used to send older messages to the client.
         * 
        */
        try {
            if (!isNumericIdCorrect(oldestReceivedMessageId)) {
                logger.info("User requested older messages with wrong last message id.")
                socket.emit('error', 'Cannot receive older messages. Invalid last message id parameter.');
                return;
            }
    
            const olderMessagesQuantity = 10;
    
            const messages = await db.getOlderMessages(chatId, oldestReceivedMessageId, olderMessagesQuantity);

            let olderMessagesExist;

            messages.length < olderMessagesQuantity ? olderMessagesExist = false : olderMessagesExist = true;

            const response = {
                messages: messages,
                olderMessagesExist: olderMessagesExist
            }

            socket.emit(reciveOlderMessageEvent, response);
    
        } catch (error) {
            logger.error(`Cannot get older messages from chat ${chatId}.`)
            logger.error(`Details: ${error.message}`);
            
            socket.emit('error', 'Internal server error. Cannot receive older messages.');
        }
    }
    
    
    const handleSendMessageByUser = async (chatId, text, broadcastMessageEvent) => {    
        /**
         * Handles sending a new message in a chat and broadcasting it to all users in the project.
         * 
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
                socket.emit('error', 'Cannot send message. Invalid message format.');
                return;
            }
    
            const message = await db.addMessage(session.projectId, chatId, text, session.userId);

            const response = {
                messages: [message],
                olderMessagesExist: null
            }
    
            io.to(session.projectId).emit(broadcastMessageEvent, response);
    
            return true;
    
        } catch (error) {
            logger.error(`Cannot add message to chat ${chatId}.`);
            logger.error(`Details: ${error.message}`);
    
            socket.emit('error', 'Internal server error. Cannot send message.');
    
            return false;
        }
    }


    const forwardMessageToAi = async (message) => {
        /**
         * Forwards a user message to the AI service for processing.
         * @param {Object} message - The message object containing the user's message.
         */
        try {
            serveUserMessageToAI(session, message, editionRegister)
        } catch (error) {
            if (
                error instanceof InvalidArgumentException ||
                error instanceof SessionIsNotRegisteredException ||
                error instanceof UnsupportedRequestTypeException
            ) {
                logger.info("User encountered an error while sending a message to AI.");
                logger.info(`Details: ${error.message}`);

                socket.emit('error', "Error during forwarding message to AI. " + error.message);
                return;
            } else {
                logger.error("Cannot serve user message to AI.");
                logger.error(`Details: ${error.message}`);
                
                socket.emit('error', 'Internal server error. Cannot forward message to AI.');
            }
        }
    };
    
    // Messeage format send to discussion chat:
    // {
    //      content: string
    // }
    socket.on('send-message-to-discussion-chat', (message) => {
        handleSendMessageByUser(projectChatsReference.discussionChatId, message.content, 'receive-message-from-discussion-chat');
    });


    // Message format send to ai chat:
    // {
    //      content: string
    //      ai: int (code)
    //      component: int (code)
    //      requestType: int (code)
    // }
    socket.on('send-message-to-ai-chat', (message) => {
        const isMessageSent = handleSendMessageByUser(socket, session.projectId, session.userId, projectChatsReference.aiChatId, message.content, 'receive-message-from-ai-chat');
        if (isMessageSent) {
            forwardMessageToAi(message);
        }
    }); 


    socket.on('get-older-messages-from-discussion-chat', (oldestReceivedMessageId) => {
        handleGetOlderMessages(
            projectChatsReference.discussionChatId, 
            oldestReceivedMessageId, 
            'receive-message-from-discussion-chat'
        );
    });


    socket.on('get-older-messages-from-ai-chat', (oldestReceivedMessageId) => {
        handleGetOlderMessages(
            projectChatsReference.aiChatId, 
            oldestReceivedMessageId, 
            'receive-message-from-ai-chat'
        );
    });
}


export const transmitMessagesOnConnection = async (socket, db, projectChatsReference) => {
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
        const getMessagesForChat = async (chatId, chatOffset, receiveMessagesEvent) => {
            if (chatOffset > 0) { 
                /** reconnection case */ 
                const messages = await db.getNewerMessages(chatId, chatOffset);

                const response = {
                    messages: messages,
                    olderMessagesExist: null
                }

                socket.emit(receiveMessagesEvent, response);
            } else { 
                /** initial connection case */ 
                const messages = await db.getNewestMessages(chatId, initConnectionMessageQuantity);

                const olderMessagesExist = messages.length >= initConnectionMessageQuantity;

                const response = {
                    messages: messages,
                    olderMessagesExist: olderMessagesExist
                }

                socket.emit(receiveMessagesEvent, response);
            }
        };

        const discussionChatOffset = socket?.handshake?.auth?.discussionChatOffset || 0;
        const aiChatOffset = socket?.handshake?.auth?.aiChatOffset || 0;

        // Handle discussion chat
        await getMessagesForChat(projectChatsReference?.discussionChatId, discussionChatOffset, 'receive-message-from-discussion-chat');

        // Handle AI chat
        await getMessagesForChat(projectChatsReference?.aiChatId, aiChatOffset, 'receive-message-from-ai-chat');

    } catch (error) {
        logger.error(`Cannot retransmit lost data.`);
        logger.error(`Details: ${error.message}`);

        socket.emit('error', 'Internal server error. Cannot retransmit data on connection.');
        socket.disconnect();
    }
};


const AI_ID = ObjectId.createFromHexString(process.env.AI_ID);

export const sendMessageByAI = async (io, db, projectId, text) => {
    /**
     * Sends a message generated by the AI to ai chat.
     * 
     * @param {Object} io - The Socket.IO server instance to emit events to connected clients.
     * @param {Object} db - The database instance for interacting with message storage.
     * @param {string} projectId - The ID of the project to which the message belongs in string representation.
     * @param {string} text - The content of the message to be sent.
     * @param {string} broadcastMessageEvent - The event name to broadcast the message to all users.
     * 
    */

    try {
        const chatId = await db.getAiChatIdFromProject(projectId);
        projectId = ObjectId.createFromHexString(projectId);

        const message = await db.addMessage(projectId, chatId, text, AI_ID);
        const broadcastMessageEvent = 'receive-message-from-ai-chat';

        const response = {
            messages: [message],
            olderMessagesExist: null
        }

        io.to(projectId).emit(broadcastMessageEvent, response);
    } catch (error) {
        logger.error(`Unexpected Error ${error}.`);
    }
}
