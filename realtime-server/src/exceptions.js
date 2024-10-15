export class UserIsNotProjectMemberException extends Error {
    constructor(message = 'User is not a member of the project.') {
        super(message);
        this.name = 'UserIsNotProjectMemberException';
    }
}


export class ComponentIsNotExistException extends Error {
    constructor(message = 'Component does not exist.') {
        super(message);
        this.name = 'ModelsIsNotExistException';
    }
}


export class ComponentIsAlreadyEditedException extends Error {
    constructor(message = 'Component is already being edited.') {
        super(message);
        this.name = 'ComponentIsAlreadyEditedException';
    }
}


export class InvalidArgumentException extends Error {
    constructor(message = 'Invalid argument.') {
        super(message);
        this.name = 'InvalidArgumentException';
    }
}


export class SessionIsNotRegisteredException extends Error {
    constructor(message = 'Session is not being edited.') {
        super(message);
        this.name = 'SessionIsNotRegisteredException';
    }
}


export class UserAlreadyHasActiveEditSessionException extends Error {
    constructor(message = 'User already has an active editing session.') {
        super(message);
        this.name = 'UserAlreadyHasActiveEditSessionException';
    }
}
