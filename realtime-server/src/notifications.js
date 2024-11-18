/**
 * This module contains classes representing notification messages sent from the server to the client.
 * Each class contains a unique `code` that identifies the type of message on the client side.
 */


export class ComponentCreatedCommunicate {
    /**
     * Notification sent when the AI completes the generation of a component for the first time.
     * Sent to all project members.
     */
    code = 1;

    constructor(componentId) {
        this.component = componentId;
    }
}


export class RefreshEditionSessionsCommunicate {
    /**
     * Notification sent after a client reconnects, informing which components are currently being edited by users.
     * The map contains components as keys and the respective users as values.
     * Sent to the client to refresh their view of the current editing sessions.
     */
    code = 11;

    constructor(componentsToUserMap) {
        this.componentsToUserMap = componentsToUserMap;
    }
}


export class InvalidRequestCommunicate {
    /**
     * Notification sent when the server receives an invalid request.
     * Sent to the client that made the request.
     */
    code = 12;

    constructor(details) {
        this.details = details;
    }
}


export class InternalServerErrorCommunicate {
    /**
     * Notification sent when an unexpected error occurs on the server.
     * Sent to the client that made the request.
     */
    code = 13;

    constructor(details) {
        this.details = details;
    }
}
