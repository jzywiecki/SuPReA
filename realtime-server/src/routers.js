/**
 * This module registers API routes related to AI events.
 * It handles various events like component creation, regeneration, update completion, and chat messages.
 * Used by server which is responsible for generation components.
 * 
 * API architecture: WEB HOOK.
 * 
 * @param {Object} app - The Express application instance used to register routes.
 * @param {AIService} aiService - The AIService instance responsible for processing the events.
 */

import { logger } from './utils.js';


export const registerRouters = (app, aiService) => {

    app.post('/event/generation-complete', (req, res) => {
        aiService.notifyComponentCreated(req);
        res.status(200).send({});
    });
    

    app.post('/event/regeneration-complete', (req, res) => {
        aiService.sendGeneratedComponent(req);
        res.status(200).send({});
    });


    app.post('/event/update-complete', (req, res) => {
        aiService.sendGeneratedComponent(req);
        res.status(200).send({});
    });
    

    app.post('/event/message', (req, res) => {
        aiService.sendMessageOnChat(req.body);
        res.status(200).send({});
    });


    app.use((err, req, res, _next) => {
        logger.error(err.stack);
        res.status(500).send({ message: 'Internal Server Error' });
    });
}
