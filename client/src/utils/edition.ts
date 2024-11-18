class EditionRegister {

    private mapComponentToUser:  Map<string, string>

    constructor(mapComponentToUser: Map<string, string>) {
        this.mapComponentToUser = mapComponentToUser;
    }

    registerEdition(component, user) {
        return this.mapComponentToUser.set(component, user);
    }

    isComponentEdited(component) {
        return this.mapComponentToUser.has(component);
    }

    isUserEditing(user) {
        
    }
}