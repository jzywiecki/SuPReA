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
        this.componentName;
    }
}
