import fs from 'fs';
import {pino} from 'pino';

const logDir = './logs';

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

export const logger = pino({
    level: 'info',
    timestamp: pino.stdTimeFunctions.isoTime
}, pino.destination('./logs/app.log'));


export const isMessageValid = (message) => {
    const content = message?.content;

    return !content || typeof content !== 'string' || content.length > 1000;
}


export const isNumericIdCorrect = (id) => {
    return typeof id === "number" && id >= 0 || typeof id === "string" && !isNaN(id) && Number(id) >= 0;
}
