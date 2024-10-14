export class UserIsNotProjectMemberException extends Error {
    constructor(message = 'User is not a member of the project.') {
        super(message);
        this.name = 'UserIsNotProjectMemberException';
    }
}


export class InternalServerError extends Error {
    constructor(message = 'Internal server error.') {
        super(message);
        this.name = 'InteralServerError';
    }
}


export class ComponentIsNotExist extends Error {
    constructor(message = 'Component does not exist.') {
        super(message);
        this.name = 'ModelsIsNotExist';
    }
}


export class ComponentIsAlreadyEdited extends Error {
    constructor(message = 'Component is already being edited.') {
        super(message);
        this.name = 'ComponentIsAlreadyEdited';
    }
}
