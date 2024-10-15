/**
 * This module contains a data structure to manage a edition sessions.
 */

import { isComponent } from "./model.js";
import { InvalidArgument } from "./exceptions.js";
import { ComponentIsAlreadyEdited } from "./exceptions.js";
import { SessionIsNotRegisteredException } from "./exceptions.js";
import { UserAlreadyHasActiveEditSession } from "./exceptions.js";


class ProjectEditionsRegister {
    /**
     * Class representing a register that stores active edition sessions for a particular project.
     * It maps components to their active editing sessions and tracks the number of active sessions.
     */

    constructor() {
        this.mapComponentToSession = new Map();
        this.mapIdToSession = new Map();
        this.activeUsersEditorsSet = new Set();
        this.activeSessionsQuantity = 0;
    }


    addSession(session, component) {
        /**
         * Adds a new editing session for a specific component.
         * 
         * @param {Object} session - The session object representing the active editing session.
         * @param {Object} component - The component name which being edited.
         * @throws {Error} If the component does not exist or is already being edited.
        */
        if (!isComponent(component)) {
            throw new InvalidArgument("Invalid component name.");
        }

        if (this.isComponentAlreadyEdited(component)) {
            throw new ComponentIsAlreadyEdited();
        }

        if (this.isActiveSessionForUser(session.userId)) {
            throw new UserAlreadyHasActiveEditSession();
        }

        this.mapComponentToSession.set(component, session);
        this.mapIdToSession.set(session.id, session);
        this.activeUsersEditorsSet.add(session.userId);

        this.activeSessionsQuantity++;
    }

    removeSession(session) {
        /**
        * Removes an active editing session for a component.
        * Searches for the session and removes it from the register.
        * 
        * @param {Object} session - The session object to be removed.
        * @throws {Error} If the session is not currently being edited (not found).
        */
        if (!this.isSessionRegistered(session.id)) {
            throw new SessionIsNotRegisteredException();
        }

        this.activeUsersEditorsSet.delete(session.userId);
        this.mapIdToSession.delete(session.id);

        this.activeSessionsQuantity--;
    }


    getActiveSessionsQuantity() {
        return this.activeSessionsQuantity;
    }


    isActiveParticularSessionForComponent(session, component) {
        /**
        * Checks if the provided session is the active editing session for the specified component.
        * 
        * @param {Object} session - The session object to check against the active session for the component.
        * @param {Object} component - The component name for which the active editing session is being checked.
        * @returns {boolean} True if the provided session is the active session for the component, false otherwise.
        * @throws {Error} If the component does not exist in the project.
        */
        if (!isComponent(component)) {
            throw new InvalidArgument("Invalid component name.");
        }

        if (!this.mapComponentToSession.has(component)) {
            return false;
        }

        return this.mapComponentToSession.get(component).equals(session);
    }


    getActiveSessions() {
        /**
        * Retrieves a list of active editing sessions for all components.
        * Each session representation contains the component's name and the user ID of the person editing the component.
        * 
        * @returns {Array} An array of objects, each containing the component name and the user ID of the active session.
        */
        const result = [];
    
        for (let [component, session] of this.mapComponentToSession.entries()) {
            if (component && session) {
                result.push({
                    component: component,
                    userId: session.userId
                });
            }
        }
    
        return result;
    }


    getSession(id) {
        /**
        * Retrieves the session object for the provided session ID.
        * 
        * @param {string} id - The ID of the user for which the session is being retrieved.
        * @returns {Object} The session object for the provided user ID.
        */
        return this.mapIdToSession.get(id);
    }


    isComponentAlreadyEdited(component) {
        return this.mapComponentToSession.has(component) && this.activeUsersEditorsSet.has(this.mapComponentToSession.get(component).userId)
    }


    isActiveSessionForUser(userId) {
        return this.activeUsersEditorsSet.has(userId)
    }


    isSessionRegistered(sessionId) {
        return this.mapIdToSession.has(sessionId)
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

    registerEditionSession(session, component) {
        /**
         * Registers a new edition session for a specific component within a project.
         * If a `ProjectEditionsRegister` does not exist for the given project, it is created.
         * 
         * @param {Object} session - The session object representing the current edition session.
         * @param {Object} component - The component name being edited in the session.
         * @throws {Error} If the component does not exist or is already being edited.
        */
        
        if (!this.register.has(session.projectId)) {
            this.register.set(session.projectId, new ProjectEditionsRegister());
        }        

        this.register.get(session.projectId).addSession(session, component);
    }


    unregisterEditionSession(session) {
        /**
         * Unregisters an edition session for a specific project and component.
         * If the project no longer has any active sessions after removal, it is deleted from the global register.
         * 
         * @param {Object} session - The session object representing the edition session to be unregistered.
         * @throws {Error} If the project does not exist in the global register.
         * @throws {Error} If the session is not found or is not active in the project's edition register.
        */
        const projectRegister = this.register.get(session.projectId);
    
        if (!projectRegister) {
            throw new SessionIsNotRegisteredException();
        }
    
        projectRegister.removeSession(session);

        if (projectRegister.getActiveSessionsQuantity() === 0) {
            this.register.delete(session.projectId);
        }
    }


    getUsersWithActiveEditionSessionForProject(projectId) {
            /**
             * Retrieves all active editing sessions for a specific project.
             * If no active sessions exist for the given project, an empty array is returned.
             * 
             * @param {string} projectId - The ID of the project for which active sessions are being retrieved.
             * @returns {Array} An array of objects, each containing the component name and the user ID of the active session.
            */
        const projectRegister = this.register.get(projectId);
        if (!projectRegister) {
            return [];
        }
        
        return projectRegister.getActiveSessions();
    }


    isEditionSessionActive(session, component) {
        /**
         * Checks whether a specific edition session is currently active for a given component in a project.
         * 
         * @param {Object} session - The session object representing the edition session to check.
         * @param {Object} component - The component for which the session is being checked.
         * @returns {boolean} True if the session is active for the given component, false otherwise.
         * @throws {Error} If the project does not exist in the global register.
         */
        const projectRegister = this.register.get(session.projectId);

        if (!projectRegister) {
            return false;
        }

        return projectRegister.isActiveSessionForComponent(session, component);
    }
}
