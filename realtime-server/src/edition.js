/**
 * This module handles events related to component edition within a project.
 * It manages the starting, finishing, and updating of edition sessions for specific components.
*/

import { RefreshEditionSessionsCommunicate } from "./notifications.js";
import { RegisterEditSessionCommunicate } from "./notifications.js";
import { UnregisterEditSessionCommunicate } from "./notifications.js";
import { EditSessionIsNotActiveCommunicate } from "./notifications.js";
import { ConfirmedUpdateRequestCommunicate } from "./notifications.js";
import { InternalServerErrorCommunicate } from "./notifications.js";
import { InvalidRequestCommunicate } from "./notifications.js";
import { ConfirmedForwardRequestToAICommunicate } from "./notifications.js";
import { logger } from './utils.js';
import {
    updateComponentByAiAPI, 
    regenerateComponentByAiAPI, 
    updateComponentAPI,
} from './gateway.js';

import { getAiSpecifiedForComponent } from "./model.js";
import {
    ComponentIsNotExistException,
    SessionIsNotRegisteredException,
    UserAlreadyHasActiveEditSessionException,
} from "./exceptions.js";
import { getComponentById } from "./model.js";


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
     * - `update-component`: Triggers `updateComponentRequestHandler` to update a component with new data.
     * - `update-component-by-ai`: Triggers `updateComponentByAIRequestHandler` to update a component with new data using AI.
     * - `regenerate-component-by-ai`: Triggers `regenerateComponentByAIRequestHandler` to regenerate a component with new data using AI.
    */
    
    socket.on('edit-component', (request) => {
        editComponentRequestHandler(request?.component, socket, io, session, editionRegister);
    });

    socket.on('finish-edition', (request) => {
        finishedEditionRequestHandler(request?.component, session, socket, io, editionRegister);
    });

    socket.on('update-component', (request) => {
        updateComponentRequestHandler(request?.component, session, editionRegister, request?.new_val);
    });

    socket.on('update-component-by-ai', (request) => {
        updateComponentByAIRequestHandler(socket, session, request?.component, request?.query, request?.ai_model, editionRegister);
    })

    socket.on('regenerate-component-by-ai', (request) => {
        regenerateComponentByAIRequestHandler(socket, session, request?.component, request?.query, request?.ai_model, editionRegister);
    })
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

        const broadcastMessage = new RegisterEditSessionCommunicate(componentId, session.userId);
        
        io.to(socket.projectId).emit('edition-register', broadcastMessage);

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

        const broadcastMessage = new UnregisterEditSessionCommunicate(componentId, session.userId)
        
        io.to(socket.projectId).emit('edition-register', broadcastMessage);

        logger.info(`User ${session.userId} finished editing component: ${componentId}`);
    }
    catch (error) {
        editionExceptionHandler(error, socket, session);
    }
}


const updateComponentRequestHandler = async (componentId, session, socket, editionRegister, new_val) => {
    /**
     * Handles the request to update a component, ensuring the session is active and properly manages responses.
     * 
     * @param {string} componentId - The identifier of the component being updated.
     * @param {Object} session - The session object containing the user's details (e.g., userId, projectId).
     * @param {Object} editionRegister - The object that manages edition sessions for components.
     * @param {any} new_val - The new value that the component should be updated with.
     * 
     * The function follows these steps:
     * - Checks if the current session is active for editing the specified component.
     * - Sends a request to an external API to update the component with the new value.
     * - Notifies the client about the success or failure of the operation.
     * 
     * @throws Will log errors and notify the client in case of failure. If an internal server error occurs, the socket is disconnected.
     */
    
    try {
        if (!editionRegister.isEditionSessionActive(session, componentId)) {
            throw new SessionIsNotRegisteredException("Cannot update component.");        
        }

        const requestData = {
            project_id: session.projectId,
            new_val: new_val
        };

        const component = getComponentById(componentId);

        await updateComponentAPI(component.name, requestData);

        logger.info(`User ${session.userId} updated component: ${component.name}`);
        
        socket.emit(
            'notify-edition',
            new ConfirmedUpdateRequestCommunicate()
        );
    } 
    catch (error) {
        editionExceptionHandler(error, socket, session);
    }
};


const updateComponentByAIRequestHandler = async (socket, session, componentValue, componentId, request, aiModelId, editionRegister) => {
    try {
        if (!editionRegister.isEditionSessionActive(session, componentId)) { 
            throw new SessionIsNotRegisteredException("Cannot update by ai component.");        
        }

        const component = getComponentById(componentId);
        
        const aiModel = getAiSpecifiedForComponent(aiModelId, component);

        const requestData = {
            project_id: session.projectId,
            session_id: session.id,
            details: request,
            ai_model: aiModel,
            component_value: componentValue,
        };
    
        await updateComponentByAiAPI(component.name, requestData);

        socket.emit(
            'notify-edition',
            new ConfirmedForwardRequestToAICommunicate()
        );

    } catch (error) {
        editionExceptionHandler(error, socket, session);
    }
};


const regenerateComponentByAIRequestHandler = async (socket, session, componentId, request, aiModelId, editionRegister) => {
    try {
        if (!editionRegister.isEditionSessionActive(session, componentId)) {
            throw new SessionIsNotRegisteredException("Cannot regenerate by ai component.");
        }

        const component = getComponentById(componentId);
        
        const aiModel = getAiSpecifiedForComponent(aiModelId, component);

        const requestData = {
            project_id: session.projectId,
            session_id: session.id,
            query: request,
            ai_model: aiModel.name,
        };
    
        await regenerateComponentByAiAPI(component.name, requestData);

        socket.emit(
            'notify-edition',
            new ConfirmedForwardRequestToAICommunicate()
        );
    } catch (error) {
        editionExceptionHandler(error, socket, session);
    }
};


const editionExceptionHandler = (error, socket, session) => {
    if (error.response) {  // EXTERNAL API ERROR
        const statusCode = error.response.status;

        if (statusCode == 422) {
            logger.error('External api error:', error.response.data);
            socket.emit(
                'error',
                new EditSessionIsNotActiveCommunicate("Invalid request data.")
            );
        }
        else {
            logger.error('Error updating database schema:', error.response.data);
            socket.emit(
                'error',
                new InternalServerErrorCommunicate("Internal server error.")
            );
        }
    }

    else if (error instanceof SessionIsNotRegisteredException) {
        logger.info(error.message);

        socket.emit(
            'error',
            new EditSessionIsNotActiveCommunicate(error?.message)
        );
    }

    else if (error instanceof ComponentIsNotExistException) {
        logger.info(`User ${session.userId} makes error: ${error.message}`);

        socket.emit(
            'error',
            new InvalidRequestCommunicate('Component does not exist.')
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