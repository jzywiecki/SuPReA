import { ComponentIsNotExist } from "./exceptions.js";


export const Components = Object.freeze({
    ACTORS: {name: "actors"},
    BUSINESS_SCENARIOS: {name: "business_scenarios"},
    ELEVATOR_SPEECH: {name: "elevator_speech"},
    MOTTO: {name: "motto"},
    PROJECT_SCHEDULE: {name: "project_schedule"},
    REQUIREMENTS: {name: "requirements"},
    RISKS: {name: "risks"},
    SPECIFICATIONS: {name: "specifications"},
    STRATEGY: {name: "strategy"},
    TITLE: {name: "title"},
    DATABASE_SCHEMA: {name: "database_schema"},
    LOGO: {name: "logo"},
});


export const getComponentByName = (name) => {
    const model = Object.values(Components).find(model => model.name === name);

    if (!model) {
        throw new ComponentIsNotExist(`Model with name ${name} does not exist.`);
    }
    return model;
}


export const isComponent = (x) => {
    return Object.values(Components).includes(x);
}
