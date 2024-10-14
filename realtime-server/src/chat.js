import { logger } from "./utils.js";
import { isMessageValid } from "./utils.js";
import { isNumericIdCorrect } from "./utils.js";


export class ProjectChatsReference {
    discussionChatId;
    aiChatId;

    constructor(discussionChatId, aiChatId) {
        this.discussionChatId = discussionChatId;
        this.aiChatId = aiChatId;
    }
}


export const registerChatEvents = (socket, session, projectChatsReference) => {
    

    socket.on('send-message-to-discussion-chat', (message) => {
        handleSendMessage(socket, session?.projectId, session?.userId, projectChatsReference?.discussionChatId, message, 'receive-message-from-discussion-chat');
    });

    socket.on('send-message-to-ai-chat', (message) => {
        handleSendMessage(socket, session?.projectId, session?.userId, projectChatsReference?.aiChatId, message, 'receive-message-from-ai-chat');
    }); 

    socket.on('get-older-messages-from-discussion-chat', (oldestReceivedMessageId) => {
        handleGetOlderMessages(
            socket, 
            session?.discussionChatId, 
            oldestReceivedMessageId, 
            'receive-message-from-discussion-chat',
            'receive-is-more-older-messages-on-discussion-chat'
        );
    });

    socket.on('get-older-messages-from-ai-chat', (oldestReceivedMessageId) => {
        handleGetOlderMessages(
            socket, 
            session?.aiChatId, 
            oldestReceivedMessageId, 
            'receive-message-from-ai-chat',
            'receive-is-more-older-messages-on-ai-chat'
        );
    });

}


export const transmitMessagesOnConnection = async (socket, projectChatsReference) => {
    try {
        const initConnectionMessageQuantity = 15;
        
        const getMessagesForChat = async (chatId, chatOffset, receiveMessagesEvent, olderMessagesExistEvent) => {
            if (chatOffset > 0) { 
                /** reconnection case */ 
                const messages = await db.getNewerMessages(chatId, chatOffset);
                socket.emit(receiveMessagesEvent, messages);
            } else { 
                /** initial connection case */ 
                const messages = await db.getNewestMessages(chatId, initConnectionMessageQuantity);
                socket.emit(receiveMessagesEvent, messages);

                if (messages.length < initConnectionMessageQuantity) {
                    socket.emit(olderMessagesExistEvent, false);
                } else {
                    socket.emit(olderMessagesExistEvent, true);
                }
            }
        };

        const discussionChatOffset = socket?.handshake?.auth?.discussionChatOffset || 0;
        const aiChatOffset = socket?.handshake?.auth?.aiChatOffset || 0;

        // Handle discussion chat
        await getMessagesForChat(projectChatsReference?.discussionChatId, discussionChatOffset, 'receive-message-from-discussion-chat', 'receive-is-more-older-messages-on-discussion-chat');

        // Handle AI chat
        await getMessagesForChat(projectChatsReference?.aiChatId, aiChatOffset, 'receive-message-from-ai-chat', 'receive-is-more-older-messages-on-ai-chat');

    } catch (error) {
        logger.error(`Cannot retransmit lost data.`);
        logger.error(`Details: ${error.message}`);

        socket.emit('error', 'INTERNAL SERVER ERROR.');
        socket.disconnect();
    }
};


const handleGetOlderMessages = async (socket, chatId, oldestReceivedMessageId, reciveOlderMessageEvent, olderMessagesExistEvent) => {
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
            socket.emit(olderMessagesExistEvent, false);
        } else {
            socket.emit(olderMessagesExistEvent, true);
        }

    } catch (error) {
        logger.error(`Cannot get older messages from chat ${chatId}.`)
        logger.error(`Details: ${error.message}`);
        socket.emit('error', 'INTERNAL SERVER ERROR');
        socket.disconnect();
    }
}


const handleSendMessage = async (socket, projectId, userId, chatId, text, broadcastMessageEvent) => {    
    try {
        if (!isMessageValid(text)) {
            logger.info("User tried to send invalid message.");
            socket.emit('error', 'Invalid message format.');
            return;
        }

        const message = await db.addMessage(projectId, chatId, text, userId);

        io.to(socket.projectId).emit(broadcastMessageEvent, message);

        return true;

    } catch (error) {
        logger.error(`Cannot add message to chat ${chatId}.`);
        logger.error(`Details: ${error.message}`);

        socket.emit('error', 'INTERNAL SERVER ERROR');
        socket.disconnect();

        return false;
    }
}
