import { sendMessageByAI } from "./chat.js";
import { ComponentCreatedCommunicate } from "./notifications.js";
import { ComponentGeneratedCommunicate } from "./notifications.js";

/**
 * AIService class handles communication and notifications for AI-related events.
 * It sends chat messages and notifies users when components are created or generated.
 * 
 * @class AIService
*/
export class AIService {
    
    constructor(editionService, io, db) {
        this.editionService = editionService;
        this.io = io;
        this.db = db;
    }


    sendMessageOnChat(message) {
        /**
         * Sends a chat message through the AI service.
         * @param {Object} message - Object containing projectId and content.
        */
        sendMessageByAI(this.io, this.db, message.projectId, message.content);
    }

    
    notifyComponentCreated(message) {
        /**
         * Notifies users when a component is created.
         * @param {Object} message - Object containing projectId and componentName.
        */
        this.io.to(message.projectId).emit(
            'notify', 
            new ComponentCreatedCommunicate(message.componentName)
        );
    }


    sendGeneratedComponent(result) {
        /**
         * Sends a generated component to the user.
         * @param {Object} result - Object containing sessionId, componentName, and component.
        */
        socket = this.getUserSocket(result.sessionId);
        if (!socket) {
            return;
        }

        socket.emit (
            'notify',
            new ComponentGeneratedCommunicate(result.componentName, result.component)
        )
    }


    getUserSocket(sessionId) {
        return this.editionService?.getSession(sessionId);
    }
}
