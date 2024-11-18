import { EditionRegister } from '../src/register';
import { Session } from '../src/connection';
import { SessionIsNotRegisteredException, UserAlreadyHasActiveEditSessionException } from '../src/exceptions';
import { InvalidArgument } from '../src/exceptions';
import { Components } from '../src/model';


test('registration of independent users for diffrent component should add them to the registry', () => {
    const PROJECT_ID = 1;
    
    const sessionOne = new Session({id: 1});
    sessionOne.userId = "1";
    sessionOne.projectId = PROJECT_ID;
    
    const sessionTwo = new Session({id: 2});
    sessionTwo.userId = "2";
    sessionTwo.projectId = PROJECT_ID;
    
    const sessionThree = new Session({id: 3});
    sessionThree.userId = "3";
    sessionThree.projectId = PROJECT_ID;

    const editionRegister = new EditionRegister();
    editionRegister.registerEditionSession(sessionOne, Components.ACTORS.id);
    editionRegister.registerEditionSession(sessionTwo, Components.BUSINESS_SCENARIOS.id);
    editionRegister.registerEditionSession(sessionThree, Components.ELEVATOR_SPEECH.id);

    const result = editionRegister.getUsersWithActiveEditionSessionForProject(PROJECT_ID);

    expect(result).toEqual([
        {component: Components.ACTORS.id, users: [sessionOne.userId]},
        {component: Components.BUSINESS_SCENARIOS.id, users: [sessionTwo.userId]},
        {component: Components.ELEVATOR_SPEECH.id, users: [sessionThree.userId]},
    ]);
});


test("registration two session for one user for same component should sucessfully register", () => {
    const PROJECT_ID = 1;
    
    const sessionOne = new Session({id: 1});
    sessionOne.userId = "1";
    sessionOne.projectId = PROJECT_ID;
    
    const sessionTwo = new Session({id: 2});
    sessionTwo.userId = "1";
    sessionTwo.projectId = PROJECT_ID;

    const editionRegister = new EditionRegister();
    editionRegister.registerEditionSession(sessionOne, Components.ACTORS.id);
    editionRegister.registerEditionSession(sessionTwo, Components.ACTORS.id);


    const result = editionRegister.getUsersWithActiveEditionSessionForProject(PROJECT_ID);

    expect(result).toEqual([
        {component: Components.ACTORS.id, users: [sessionOne.userId]},
]);});


test("registration two session for one user for different component should sucessfully register", () => {
    const PROJECT_ID = 1;
    
    const sessionOne = new Session({id: 1});
    sessionOne.userId = "1";
    sessionOne.projectId = PROJECT_ID;
    
    const sessionTwo = new Session({id: 2});
    sessionTwo.userId = "1";
    sessionTwo.projectId = PROJECT_ID;

    const editionRegister = new EditionRegister();
    editionRegister.registerEditionSession(sessionOne, Components.ACTORS.id);
    editionRegister.registerEditionSession(sessionTwo, Components.LOGO.id);


    const result = editionRegister.getUsersWithActiveEditionSessionForProject(PROJECT_ID);

    expect(result).toEqual([
        {component: Components.ACTORS.id, users: [sessionOne.userId]},
        {component: Components.LOGO.id, users: [sessionOne.userId]},
    ]);});



test("registration two independent session for one component should add this sessions to registry", () => {
    const PROJECT_ID = 1;
    
    const sessionOne = new Session({id: 1});
    sessionOne.userId = "1";
    sessionOne.projectId = PROJECT_ID;
    
    const sessionTwo = new Session({id: 2});
    sessionTwo.userId = "2";
    sessionTwo.projectId = PROJECT_ID;

    const editionRegister = new EditionRegister();
    editionRegister.registerEditionSession(sessionOne, Components.ACTORS.id);
    editionRegister.registerEditionSession(sessionTwo, Components.ACTORS.id);

    const result = editionRegister.getUsersWithActiveEditionSessionForProject(PROJECT_ID);

    expect(result).toEqual([
        {component: Components.ACTORS.id, users: [sessionOne.userId, sessionTwo.userId]},
    ]);
});


test("registration session with wrong componentId should throw error", () => {
    const PROJECT_ID = 1;
    
    const sessionOne = new Session({id: 1});
    sessionOne.userId = "1";
    sessionOne.projectId = PROJECT_ID;

    const editionRegister = new EditionRegister();

    expect(() => editionRegister.registerEditionSession(sessionOne, -1)).toThrow(InvalidArgument);
});


test("unregistering existing session should unregist existing session", () => {
    const PROJECT_ID = 1;
    
    const sessionOne = new Session({id: 1});
    sessionOne.userId = 1;
    sessionOne.projectId = PROJECT_ID;

    const editionRegister = new EditionRegister();
    editionRegister.registerEditionSession(sessionOne, Components.ACTORS.id);

    editionRegister.unregisterEditionSession(sessionOne);
    const result = editionRegister.getUsersWithActiveEditionSessionForProject(PROJECT_ID);

    expect(result).toEqual([]);
});


test("unregistering not existing session should throw SessionIsNotRegisteredException", () => {
    const PROJECT_ID = 1;
    
    const sessionOne = new Session({id: 1});
    sessionOne.userId = 1;
    sessionOne.projectId = PROJECT_ID;

    const editionRegister = new EditionRegister();

    expect(() => editionRegister.unregisterEditionSession(sessionOne)).toThrow(SessionIsNotRegisteredException);
});


test('unregistering session should remove it from the registry', () => {
    const PROJECT_ID = 1;
    
    const sessionOne = new Session({id: 1});
    sessionOne.userId = "1";
    sessionOne.projectId = PROJECT_ID;
    
    const sessionTwo = new Session({id: 2});
    sessionTwo.userId = "2";
    sessionTwo.projectId = PROJECT_ID;
    
    const sessionThree = new Session({id: 3});
    sessionThree.userId = "3";
    sessionThree.projectId = PROJECT_ID;

    const editionRegister = new EditionRegister();
    editionRegister.registerEditionSession(sessionOne, Components.ACTORS.id);
    editionRegister.registerEditionSession(sessionTwo, Components.BUSINESS_SCENARIOS.id);
    editionRegister.registerEditionSession(sessionThree, Components.ELEVATOR_SPEECH.id);

    editionRegister.unregisterEditionSession(sessionTwo);

    const result = editionRegister.getUsersWithActiveEditionSessionForProject(PROJECT_ID);

    expect(result).toEqual([
        {component: Components.ACTORS.id, users: [sessionOne.userId]},
        {component: Components.ELEVATOR_SPEECH.id, users: [sessionThree.userId]},
    ]);
});


test('unregistering unregisted session should throw SessionsIsNotRegisteredException', () => {
    const PROJECT_ID = 1;

    const sessionOne = new Session({id: 1});
    sessionOne.userId = 1;
    sessionOne.projectId = PROJECT_ID;

    const editionRegister = new EditionRegister();
    editionRegister.registerEditionSession(sessionOne, Components.ACTORS.id);
    editionRegister.unregisterEditionSession(sessionOne);

    expect(() => editionRegister.unregisterEditionSession(sessionOne)).toThrow(SessionIsNotRegisteredException);
});
