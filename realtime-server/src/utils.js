import {pino} from 'pino';

const SERVER_URL = process.env.SERVER_URL;


export const logger = pino({
    level: 'info',
    timestamp: pino.stdTimeFunctions.isoTime
}, pino.destination('./logs/app.log'));


export const isMessageValid = (message) => {
    content = message?.content;

    return !content || typeof content !== 'string' || content.length > 1000;
}


export const isNumericIdCorrect = (id) => {
    return !id || typeof id !== 'number' || id < 0;
}


export const getUpdateComponentURL = (component) => {
    return SERVER_URL + `/model/${component}/update`;
}


export const getGenerateComponentByAiURL = (component) => {
    return SERVER_URL + `/model/${component}/ai-update`;
}


export const getRegenerateComponentByAiURL = (component) => {
    return SERVER_URL + `/model/${component}/ai-regenerate`;
}
