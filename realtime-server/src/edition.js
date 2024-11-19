/**
 * This module handles events related to component edition within a project.
 * It manages the starting, finishing, and updating of edition sessions for specific components.
*/

import { RefreshEditionSessionsCommunicate } from "./notifications.js";
import { InternalServerErrorCommunicate } from "./notifications.js";
import { InvalidRequestCommunicate } from "./notifications.js";
import { logger } from './utils.js';

import {
    ComponentIsNotExistException,
    UserAlreadyHasActiveEditSessionException,
    SessionIsNotRegisteredException,
    SessionIsRegistered,
} from "./exceptions.js";


export const registerEditionEvents = (socket, session, io, editionRegister) => {
    /**
     * Registers event listeners for various component edition-related actions.
     * 
     * This function listens to events from the socket and triggers the appropriate request handlers.
     * 
     * @param {Socket} socket - The socket object used to communicate with the client.
     * @param {Session} session - The current user session, containing user and project information.
     * @param {EditionRegister} editionRegister - An object responsible for tracking active editions.
     * 
     * Listens for the following events:
     * - `edit-component`: Triggers `editComponentRequestHandler` to start editing a component.
     * - `finish-edition`: Triggers `finishedEditionRequestHandler` to finish the current edition.
    */
    
    socket.on('edit-component', (request) => {
        editComponentRequestHandler(request?.component, socket, io, session, editionRegister);
    });

    socket.on('finish-edition', (request) => {
        finishedEditionRequestHandler(request?.component, session, socket, io, editionRegister);
    });
}


export const transmitEditionsStatusOnConnection = async (socket, session, editionRegister) => {
    /**
     * Sends the status of active edition sessions to the client upon connection.
     * 
     * Retrieves users with active edition sessions for the project and emits this data.
     * If an error occurs, an error message is sent.
     * 
     * @param {Socket} socket - The socket object to communicate with the client.
     * @param {Session} session - The current user session.
     * @param {EditionRegister} editionRegister - Manages active edition sessions.
     * 
     * Emits:
     * - `notify`: List of users with active edition sessions.
     * - `error`: "INTERNAL SERVER ERROR" on failure.
     */

    try {
        const activeSessions = editionRegister.getUsersWithActiveEditionSessionForProject(session.projectId);
    
        socket.emit(
            'edition-register',
            new RefreshEditionSessionsCommunicate(activeSessions)
        );
    }
    catch (error) {
        editionExceptionHandler(error, socket, session);
    }
};


const editComponentRequestHandler = (componentId, socket, io, session, editionRegister) => {
    /**
     * Handles the request to start editing a component.
     * 
     * Registers an edition session for the user and component, broadcasts the event to other users, 
     * and sends appropriate notifications to the client. Handles errors for non-existent or already edited components.
     * 
     * @param {string} componentId - The ID of the component to be edited.
     * @param {Socket} socket - The socket object used to communicate with the client.
     * @param {SocketIO.Server} io - The server object used to communicate with all clients.
     * @param {Session} session - The current user session.
     * @param {EditionRegister} editionRegister - Manages edition sessions.
     * 
     * Emits:
     * - `notify`: Confirmation of starting the edition or error messages (if component does not exist or is already being edited).
     * - Broadcasts: `RegisterEditSessionCommunicate` to notify other users of the edition.
     */

    try {
        editionRegister.registerEditionSession(session, componentId);

        const activeSessions = editionRegister.getUsersWithActiveEditionSessionForProject(session.projectId);
    
        io.to(socket.projectId).emit(
            'edition-register',
            new RefreshEditionSessionsCommunicate(activeSessions)
        );
        
        logger.info(`User ${session.userId} started editing component: ${componentId}`);
    }
    catch (error) {
        editionExceptionHandler(error, socket, session);
    }
};


const finishedEditionRequestHandler = (componentId, session, socket, io, editionRegister) => {
    /**
     * Handles the request to finish an edition session.
     * 
     * Unregisters the edition session, broadcasts the event to other users, and sends appropriate notifications.
     * Handles errors if no edition session is active for the user.
     * 
     * @param {string} componentId - The ID of the component to be edited.
     * @param {Session} session - The current user session.
     * @param {Socket} socket - The socket object used to communicate with the client.
     * @param {SocketIO.Server} io - The server object used to communicate with all clients.
     * @param {EditionRegister} editionRegister - Manages edition sessions.
     * 
     * Emits:
     * - `notify`: Confirmation of finishing the edition or error messages (if no active session).
     * - Broadcasts: `UnregisterEditSessionCommunicate` to notify other users of the session end.
     */

    try {
        editionRegister.unregisterEditionSession(session);

        const activeSessions = editionRegister.getUsersWithActiveEditionSessionForProject(session.projectId);
    
        io.to(socket.projectId).emit(
            'edition-register',
            new RefreshEditionSessionsCommunicate(activeSessions)
        );

        logger.info(`User ${session.userId} finished editing component: ${componentId}`);
    }
    catch (error) {
        editionExceptionHandler(error, socket, session);
    }
}


export const editionSessionGarbageCollector = (editionRegister, session, io) => {
    try {
        if (editionRegister.isSessionRegistered(session.id, session.projectId)) {
            editionRegister.unregisterEditionSession(session);

            const activeSessions = editionRegister.getUsersWithActiveEditionSessionForProject(session.projectId);

            io.to(session.projectId).emit(
                'edition-register',
                new RefreshEditionSessionsCommunicate(activeSessions)
            );
        }
    }
    catch (error) {
        logger.error("Error while cleaning up edition session.", error);
    }
}


const editionExceptionHandler = (error, socket, session) => {

    if (error instanceof ComponentIsNotExistException) {
        logger.info(`User ${session.userId} makes error: ${error.message}`);

        socket.emit(
            'error',
            new InvalidRequestCommunicate('Component does not exist.')
        );
    }

    else if (error instanceof SessionIsNotRegisteredException) {
        logger.info(`User ${session.userId} tried to finish an edition session without an active session: ${error.message}`);

        socket.emit(
            'error',
            new InvalidRequestCommunicate('No active edition session.')
        );
    }

    else if (error instanceof SessionIsRegistered) {
        logger.info(`User ${session.userId} tried to edit a component while already editing another component: ${error.message}`);

        socket.emit(
            'error',
            new InvalidRequestCommunicate('Session is already being edited.')
        );
    }


    else if (error instanceof UserAlreadyHasActiveEditSessionException) {
        logger.info(`User ${session.userId} tried to edit a component while already editing another component: ${error.message}`);

        socket.emit(
            'error',
            new InvalidRequestCommunicate('User already has an active edit session.')
        );
    }
        
    else {
        logger.error("Interal server error.", error);

        socket.emit(
            'error',
            new InternalServerErrorCommunicate("Internal server error.")
        );
    }
}
