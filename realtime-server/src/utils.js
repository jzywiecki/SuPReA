import {pino} from 'pino';


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
