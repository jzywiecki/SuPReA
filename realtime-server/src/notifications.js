/**
 * This module contains classes representing notification messages sent from the server to the client.
 * Each class contains a unique `code` that identifies the type of message on the client side.
 */


export class ComponentGeneratedCommunicate {
    /**
     * Message representing a response from the AI to a regeneration/update request.
     * Sent to the specific client that made the request.
     * 
     */
    code = 0;

    constructor(componentName, component) {
        this.componentName = componentName;
        this.component = component;
    }
}


export class ComponentCreatedCommunicate {
    /**
     * Notification sent when the AI completes the generation of a component for the first time.
     * Sent to all project members.
     */
    code = 1;

    constructor(componentName) {
        this.componentName = componentName;
    }
}


export class RegisterEditSessionCommunicate {
    /**
     * Notification informing about the start of a new editing session.
     * Sent to all project members.
     */
    code = 2;
    
    constructor(componentName, userId) {
        this.componentName = componentName;
        this.userId = userId;
    }
}


export class UnregisterEditSessionCommunicate {
    /**
     * Notification informing about the end of an editing session.
     * Sent to all project members.
     */
    code = 3;

    constructor(componentName) {
        this.componentName = componentName;
    }
}


export class ConfirmationEditionSessionCommunicate {
    /**
     * Notification informing about the successful registration of an editing session.
     * Sent to the client that requested the editing session.
     */
    code = 4;

    constructor(sessionToken) {
        this.sessionToken = sessionToken;
    }
}


export class RejectedEditionSessionRegisterRequestCommunicate {
    /**
     * Notification informing about the rejection registration of an editing session.
     * Sent to the client that requested the editing session.
     */
    code = 5;

    constructor(details) {
        this.details = details;
    }
}


export class RejectedRequestCommunicates {
    /**
     * Notification informing about the rejection of any user request (e.g., an AI update).
     * Sent to the client that made the request.
     */
    code = 6;

    constructor(details) {
        this.details = details;
    }
}


export class DiscussionChatNoOlderMessagesCommunicates {
    /**
     * Notification informing that there are no more new messages in the discussion chat.
     * Sent to the client to indicate that all messages have been read.
     */
    code = 7;
}


export class AIChatNoOlderMessagesCommunicates {
    /**
     * Notification informing that there are no more new messages in the AI chat.
     * Sent to the client to indicate that all messages have been read.
     */
    code = 8;
}


export class RefreshEditionSessionsCommunicates {
    /**
     * Notification sent after a client reconnects, informing which components are currently being edited by users.
     * The map contains components as keys and the respective users as values.
     * Sent to the client to refresh their view of the current editing sessions.
     */
    code = 9;

    constructor(componentsToUserMap) {
        this.componentsToUserMap = componentsToUserMap;
    }
}
