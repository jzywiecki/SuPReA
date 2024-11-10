import { ComponentIsNotExistException } from "./exceptions.js";


export const Components = Object.freeze({
    ACTORS: {id: 1, name: "actors"},
    BUSINESS_SCENARIOS: {id: 2, name: "business_scenarios"},
    ELEVATOR_SPEECH: {id: 3, name: "elevator_speech"},
    MOTTO: {id: 4, name: "motto"},
    PROJECT_SCHEDULE: {id: 5, name: "project_schedule"},
    REQUIREMENTS: {id: 6, name: "requirements"},
    RISKS: {id: 7, name: "risks"},
    SPECIFICATIONS: {id: 8, name: "specifications"},
    STRATEGY: {id: 9, name: "strategy"},
    TITLE: {id: 10, name: "title"},
    DATABASE_SCHEMA: {id: 11, name: "database_schema"},
    LOGO: {id: 12, name: "logo"},
    SUGGESTED_TECHNOLOGIES: {id: 13, name: "suggested_technologies"},
});


export const getComponentById = (id) => {
    const model = Object.values(Components).find(model => model.id == id);

    if (!model) {
        throw new ComponentIsNotExistException(`Model with id ${id} does not exist.`);
    }
    return model;
}


export const getComponentyByName = (name) => {
    const model = Object.values(Components).find(model => model.name == name);

    if (!model) {
        throw new ComponentIsNotExistException(`Model with name ${name} does not exist.`);
    }
    return model;
}


export const isComponentIdCorrect = (id) => {
    return id >= 1 && id <= 12;
}


export const AITextModels = Object.freeze({
    GPT35Turbo: {id: 1, name: "gpt-35-turbo"},
    GPT4oMini: {id: 2, name: "gpt-4o-mini"},
    Llama32: {id: 3, name: "llama-3.2"}
});


export const AIImageModels = Object.freeze({
    DALL_E3: {id: 1, name: "dall-e-3"},
    DALL_E2: {id: 2, name: "dall-e-2"},
});


export const getAITextModelById = (id) => {
    const model = Object.values(AITextModels).find(model => model.id == id);
    return model || AITextModels.GPT35Turbo;
}


export const getAIImageModelById = (id) => {
    const model = Object.values(AIImageModels).find(model => model.id == id);
    return model || AIImageModels.DALL_E3;
}

export const getAiSpecifiedForComponent = (aiId, component) => {
    if (component.LOGO) {
        return getAIImageModelById(aiId);
    }

    return getAITextModelById(aiId);
}