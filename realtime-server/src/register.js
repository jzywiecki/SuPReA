/**
 * This module contains a data structure to manage a edition sessions.
 */

import { isComponentIdCorrect } from "./model.js";
import { 
    ComponentIsNotExistException,
    SessionIsNotRegisteredException,
    SessionIsRegistered,
 } from "./exceptions.js";



class ProjectEditionsRegister {
    /**
     * Class representing a register that stores active edition sessions for a particular project.
     * It maps components to their active editing sessions and tracks the number of active sessions.
     */

    constructor() {
        this.mapComponentToSessions = new Map();
        this.mapSessionIdToSession = new Map();
        this.sessionSets = new Set();
        this.activeSessionsQuantity = 0;
    }


    addSession(session, componentId) {
        /**
         * Adds a new editing session for a specific component.
         * 
         * @param {Object} session - The session object representing the active editing session.
         * @param {Number} componentId - The ID of the component being edited.
         * @throws {ComponentIsNotExistException} If the component ID is invalid.
         * @throws {UserAlreadyHasActiveEditSessionException} If the user already has an active edit session.
        */
        if (!isComponentIdCorrect(componentId)) {
            throw new ComponentIsNotExistException("Invalid component ID.");
        }

        if (this.mapSessionIdToSession.has(session.id)) {
            throw new SessionIsRegistered("User already has an active edit session.");
        }
    
        // Initialize the component's session array if it doesn't exist
        if (!this.mapComponentToSessions.has(componentId)) {
            this.mapComponentToSessions.set(componentId, []);
        }
    
        // Add the session to component's session list and to global session maps
        this.mapComponentToSessions.get(componentId).push(session);
        this.mapSessionIdToSession.set(session.id, session);
        this.sessionSets.add(session);
    
        // Increment the active session count
        this.activeSessionsQuantity++;
    }
    

    removeSession(sessionId) {
        /**
        * Removes an active editing session for a component.
        * 
        * @param {Object} session - The session object to be removed.
        * @throws {SessionIsNotRegisteredException} If the session is not registered.
        */
        if (!this.isSessionRegistered(sessionId.id)) {
            throw new SessionIsNotRegisteredException("Cannot remove a session that is not registered.");
        }
    
        const componentId = this.getComponentForSession(sessionId.id);
        const sessions = this.mapComponentToSessions.get(componentId);
        const sessionIndex = sessions.findIndex(s => s.id === sessionId.id);
    
        if (sessionIndex !== -1) {
            // Remove the session from the component's session array
            sessions.splice(sessionIndex, 1);
    
            // If no sessions remain for this component, remove the componentId entry
            if (sessions.length === 0) {
                this.mapComponentToSessions.delete(componentId);
            }
        }
    
        // Remove session from global maps and active users set
        this.mapSessionIdToSession.delete(sessionId.id);
        this.sessionSets.delete(sessionId);
    
        // Decrement the active session count
        this.activeSessionsQuantity--;
    }
    

    getActiveSessionsQuantity() {
        return this.activeSessionsQuantity;
    }


    getActiveSessions() {
        /**
        * Retrieves a list of active editing sessions for all components,
        * ensuring that each list of users contains unique user IDs.
        * 
        * @returns {Array} An array of objects, each containing the component id and the unique users.
        */
        const result = [];
    
        for (let [component, sessions] of this.mapComponentToSessions.entries()) {
            const result_element = { "component": component, "users": [] };
            if (component && sessions) {
                const userSet = new Set();
                for (let session of sessions) {
                    userSet.add(session.userId.toString());
                }
                result_element.users = Array.from(userSet);
                result.push(result_element);
            }
        }
    
        return result;
    }    


    isSessionRegistered(sessionId) {
        return this.mapSessionIdToSession.has(sessionId)
    }


    getComponentForSession(sessionId) {
        /**
        * Retrieves the component ID for a given session ID.
        * 
        * @param {string} sessionId - The ID of the session for which the component is being retrieved.
        * @returns {Number|null} The ID of the component associated with the session, or null if not found.
        */
        
        for (let [componentId, sessions] of this.mapComponentToSessions.entries()) {
            if (sessions.some(session => session.id === sessionId)) {
                return componentId;
            }
        }
        
        return null;
    }

}


export class EditionRegister {
    /**
     * Class representing a global edition session register.
     * This class manages a collection of `ProjectEditionsRegister` instances, each corresponding to a specific project.
     * It provides functionality for tracking active edition sessions across multiple projects.
     */

    constructor() {
        this.register = new Map(); //map projectId -> ProjectEditionsRegister
    }

    registerEditionSession(session, componentId) {
        /**
         * Registers a new edition session for a specific component within a project.
         * If a `ProjectEditionsRegister` does not exist for the given project, it is created.
         * 
         * @param {Object} session - The session object representing the current edition session.
         * @param {Number} componentId - The component id being edited in the session.
         * @throws {Error} If the component does not exist or is already being edited.
        */
        
        if (!this.register.has(session.projectId.toString())) {
            this.register.set(session.projectId.toString(), new ProjectEditionsRegister());
        }        

        this.register.get(session.projectId.toString()).addSession(session, componentId);
    }


    unregisterEditionSession(session) {
        /**
         * Unregisters an edition session for a specific project and component.
         * If the project no longer has any active sessions after removal, it is deleted from the global register.
         * 
         * @param {Object} session - The session object representing the edition session to be unregistered.
         * @returns {boolean} True if the session was successfully unregistered.
         * @throws {Error} If the session is not being edited.
         * 
        */
        const projectRegister = this.register.get(session.projectId.toString());
    
        if (!projectRegister) {
            throw new SessionIsNotRegisteredException("Cannot remove a session that is not registered.");
        }
    
        const result = projectRegister.removeSession(session);

        if (projectRegister.getActiveSessionsQuantity() === 0) {
            this.register.delete(session.projectId.toString());
        }

        return result;
    }


    getUsersWithActiveEditionSessionForProject(projectId) {
            /**
             * Retrieves all active editing sessions for a specific project.
             * If no active sessions exist for the given project, an empty array is returned.
             * 
             * @param {ObjectId} projectId - The ID of the project for which active sessions are being retrieved.
             * @returns {Array} An array of objects, each containing the component name and the user ID of the active session.
            */
        const projectRegister = this.register.get(projectId.toString());
        if (!projectRegister) {
            return [];
        }
        
        return projectRegister.getActiveSessions();
    }


    isSessionRegistered(sessionId, projectId) {
        /**
         * Checks if a session is registered in the global edition register.
         * 
         * @param {string} sessionId - The ID of the session to be checked.
         * @param {ObjectId} projectId - The ID of the project in which the session is registered.
         * 
         * @returns {boolean} True if the session is registered, false otherwise.
         */

        if (!this.register.has(projectId.toString())) {
            return false;
        }

        return this.register.get(projectId.toString()).isSessionRegistered(sessionId);
    }
}
