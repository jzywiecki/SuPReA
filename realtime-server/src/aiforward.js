import { getComponentById } from "./model.js";
import { getAIImageModelById } from "./model.js";
import { getAITextModelById } from "./model.js";
import { isComponentIdCorrect } from "./model.js";
import { UnsupportedRequestTypeException } from "./exceptions.js";
import { InvalidArgumentException } from "./exceptions.js";
import { SessionIsNotRegisteredException } from "./exceptions.js";
import {
    updateComponentByAiAPI, 
    regenerateComponentByAiAPI, 
    questionToAiAPI} 
from './gateway.js';
import { Components } from './model.js';


const RequestType = Object.freeze({
    QUESTION: {id: 1},
    REGENERATION: {id: 2},
    UPDATE: {id: 3},
});


const getRequestTypeById = (id) => {
    const requestType = Object.values(RequestType).find(requestType => requestType.id === id);
    return requestType || RequestType.QUESTION;
}


export const serveUserMessageToAI = (session, message, editionRegister) => {
    
    const validGenerationRequest = (message, session) => {
        if (!isComponentIdCorrect(message?.componentId)) {
            throw InvalidArgumentException('Invalid component id.');
        }

        if (!editionRegister.isEditionSessionActive(session, message?.componentId)) {
            throw SessionIsNotRegisteredException();
        }
    }


    const selectAiModelForQuestion = (aiId, componentId) => {
        if (componentId === Components.LOGO.id) {
            throw UnsupportedRequestTypeException('Logo component does not support questions.');
        }

        return getAITextModelById(aiId);
    }


    const selectAiModelForRegeneration = (aiId, componentId) => {
        if (componentId === Components.LOGO.id) {
            return getAIImageModelById(aiId);
        } else {
            return getAITextModelById(aiId);
        }
    }


    const selectAiModelForUpdate = (aiId, componentId) => {
        if (componentId === Components.LOGO.id) {
            throw UnsupportedRequestTypeException('Logo component does not update request.');
        }

        return getAITextModelById(aiId);
    }


    const requestType = getRequestTypeById(message.requestType);

    let aiModel;

    switch (requestType) {
        case RequestType.QUESTION:
            aiModel = selectAiModelForQuestion(message.aiId, message.componentId);

            serveQuestionToAI(message, aiModel);
            break;
        case RequestType.REGENERATION:
            validGenerationRequest(message, session);
            aiModel = selectAiModelForRegeneration(message.aiId, message.component);
            
            serveRegenerateRequestToAI(session, message, aiModel);
            break;
        case RequestType.UPDATE:
            validGenerationRequest(message, session);
            aiModel = selectAiModelForUpdate(message.aiId, message.component);

            serveUpdateRequestToAI(session, message, aiModel);
            break;
    }
}


const serveQuestionToAI = async (message, aiModel) => {
    const requestData = {
        content: message.content,
        ai_model: aiModel.name,
    };
    questionToAiAPI(requestData);
}


const serveRegenerateRequestToAI = async (session, message, aiModel) => {
    const component = getComponentById(message.componentId);

    const requestData = {
        project_id: session.projectId,
        session_id: session.id,
        details: message.content,
        ai_model: aiModel.name,
    };

    regenerateComponentByAiAPI(component, requestData);
}


const serveUpdateRequestToAI = async (session, message, aiModel) => {
    const component = getComponentById(message.componentId);

    const requestData = {
        project_id: session.projectId,
        session_id: session.id,
        query: message.content,
        ai_model: aiModel.name,
    };

    updateComponentByAiAPI(component, requestData);
}
