import { sendMessageByAI } from "./chat.js";
import { ComponentCreatedCommunicate } from "./notifications.js";
import { ComponentGeneratedCommunicate } from "./notifications.js";


export class AIService {
    
    constructor(editionService, io, db) {
        this.editionService = editionService;
        this.io = io;
        this.db = db;
    }


    sendMessageOnChat(message) {
        sendMessageByAI(this.io, this.db, message.projectId, message.content);
    }

    
    notifyComponentCreated(message) {
        this.io.to(message.projectId).emit(
            'notify', 
            new ComponentCreatedCommunicate(message.componentName)
        );
    }


    sendGeneratedComponent(result) {
        socket = this.getSession(result.sessionId);
        if (!socket) {
            return;
        }

        socket.emit (
            'notify',
            new ComponentGeneratedCommunicate(result.componentName, result.component)
        )
    }


    getUserSocket(userId) {
        this.editionService
    }
}