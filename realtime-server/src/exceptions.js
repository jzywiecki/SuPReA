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
    constructor(message = 'Model does not exist.') {
        super(message);
        this.name = 'ModelsIsNotExist';
    }
}
