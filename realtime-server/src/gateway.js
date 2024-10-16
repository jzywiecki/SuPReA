/**
 * This module contains functions for:
 * - Updating a specific component via the main server API.
 * - Requesting AI to generate or update a component via the main server API.
 */
import 'dotenv/config'


const SERVER_URL = process.env.SERVER_URL;


const getUpdateComponentURL = (component) => {
    return SERVER_URL + `/model/${component}/update`;
}


const getUpdateComponentByAiURL = (component) => {
    return SERVER_URL + `/model/${component}/ai-update`;
}


const getRegenerateComponentByAiURL = (component) => {
    return SERVER_URL + `/model/${component}/ai-regenerate`;
}


const getQuestionToAiURL = (component) => {
    return SERVER_URL + `/aiassistant/question`;
}


export const updateComponentAPI = async (component, requestData) => {
    const apiUrl = getUpdateComponentURL(component);
    
    return await axios.put(apiUrl, requestData);
};


export const updateComponentByAiAPI = async (component, requestData) => {
    const apiUrl = getUpdateComponentByAiURL(component);
    
    return await axios.post(apiUrl, requestData);
};


export const regenerateComponentByAiAPI = async (component, requestData) => {
    const apiUrl = getRegenerateComponentByAiURL(component);
    
    return await axios.post(apiUrl, requestData);
};


export const questionToAiAPI = async (requestData) => {
    const apiUrl = getQuestionToAiURL();

    return await axios.post(apiUrl, requestData);
};
