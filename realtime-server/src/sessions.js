/**
 * This module contains a data structure to manage a edition sessions.
 */

import { isComponent } from "./model.js";
import { InvalidArgument } from "./exceptions.js";
import { ComponentIsAlreadyEdited } from "./exceptions.js";
import { SessionIsNotBeingEdited } from "./exceptions.js";


class ProjectEditionsRegister {
    /**
     * Class representing a register that stores active edition sessions for a particular project.
     * It maps components to their active editing sessions and tracks the number of active sessions.
     */

    constructor() {
        this.mapComponentToSession = new Map();
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

        if (this.mapComponentToSession.has(component)) {
            throw new ComponentIsAlreadyEdited("Component is already being edited.");
        }

        this.mapComponentToSession.set(component, session);
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
        for (let [component, currentSession] of this.mapComponentToSession) {
            if (currentSession.equals(session)) {
                this.mapComponentToSession.delete(component);
                this.activeSessionsQuantity--;
                return;
            }
        }
        throw new SessionIsNotBeingEdited();
    }


    getActiveSessionsQuantity() {
        return this.activeSessionsQuantity;
    }


    isActiveSessionForComponent(session, component) {
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
            throw new SessionIsNotBeingEdited();
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
