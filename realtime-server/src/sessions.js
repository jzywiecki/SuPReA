import { isComponent } from "./model.js";


class ProjectEditionsRegister {

    constructor() {
        this.mapComponentToSession = new Map();
        this.activeSessionsQuantity = 0;
    }

    addSession(session, component) {
        if (!isComponent(component)) {
            throw new Error("Component does not exist.");
        }

        if (this.mapComponentToSession.has(component)) {
            throw new Error("Component is already being edited.");
        }

        this.mapComponentToSession.set(component, session);
        this.activeSessionsQuantity++;
    }

    removeSession(session) {
        for (let [component, currentSession] of this.mapComponentToSession) {
            if (currentSession.equals(session)) {
                this.mapComponentToSession.delete(component);
                this.activeSessionsQuantity--;
                return;
            }
        }

        throw new Error("Session is not being edited.");
    }

    getActiveSessionsQuantity() {
        return this.activeSessionsQuantity;
    }


    isActiveSessionForComponent(session, component) {
        if (!isComponent(component)) {
            throw new Error("Component does not exist.");
        }

        if (!this.mapComponentToSession.has(component)) {
            return false;
        }

        return this.mapComponentToSession.get(component).equals(session);
    }


    getActiveSessios() {
        const result = [];

        for (let [component, session] of this.mapComponentToSession.entries()) {
            if (component && session) {
                result.push({
                    component: component.name,
                    userId: session.userId
                });
            }
        }

        return result;
    }
}


export class EditionRegister {

    constructor() {
        this.register = new Map();
    }

    registerEditionSession(session, component) {
        
        if (!this.register.has(session.projectId)) {
            this.register.set(session.projectId, new ProjectEditionsRegister());
        }        

        this.register.get(session.projectId).addSession(session, component);
    }


    unregisterEditionSession(session) {
        const projectRegister = this.register.get(session.projectId);
    
        if (!projectRegister) {
            throw new Error("Project does not exist.");
        }
    
        this.register.get(session.projectId).removeSession(session);

        if (this.register.get(session.projectId).getActiveSessionsQuantity() === 0) {
            this.register.delete(session.projectId);
        }
    }


    getSessionsForProject(projectId) {
        const projectRegister = this.register.get(projectId);
        if (!projectRegister) {
            return [];
        }
        
        return [...projectRegister.mapComponentToSession.values()].map(session => session.userId);
    }


    isEdiitonSessionActive(session, component) {
        const projectRegister = this.register.get(session?.projectId);

        if (!projectRegister) {
            return false;
        }

        return projectRegister.isActiveSessionForComponent(session, component);
    }   
}
