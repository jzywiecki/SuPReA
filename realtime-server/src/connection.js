/**
 * This module defines the connection service that handles the communication between the server and clients in a real-time application.
 * It establishes a WebSocket connection, manages user sessions, and provides real-time updates for messages and edition statuses.
 */

import { transmitMessagesOnConnection } from './chat.js';
import { transmitEditionsStatusOnConnection } from './edition.js';
import { registerChatEvents } from './chat.js';
import { registerEditionEvents } from './edition.js';
import { ObjectId } from 'mongodb';
import { ProjectChatsReference } from './chat.js';


export class Session {
    /**
     * Represents a user session within a project.
    */
    id;
    socket;
    userId;
    projectId;

    constructor(socket) {
        this.socket = socket;
        this.id = socket.id;
    }

    equals(session) {
        return this.id === session.id;
    }
}


export const connectionService = (io, db) => {
    /**
    * The main connection service responsible for handling user connections and real-time events in the project.
    * Here we can added a specific logic for particular client-server session.
    * After the connection/reconnection is established, this code is executed.
    * 
    * @param {Object} io - The Socket.IO server instance to handle WebSocket connections.
    * @param {Object} db - The database object used to interact with the project's data.
    */

    io.on('connection', async (socket) => {
        logger.info('User connected');
        logger.info(`socket id: ${socket.id}`);
        logger.info(`user id: ${socket.userId}`);

        try {
            const session = new Session(socket);

            const userId = socket?.handshake?.auth?.userId;
            const projectId = socket?.handshake?.auth?.projectId;

            session.projectId = ObjectId.createFromHexString(projectId);
            session.userId = ObjectId.createFromHexString(userId);

            const projectChatsReference = new ProjectChatsReference(
                await db.getDiscussionChatIdFromProject(session.projectId),
                await db.getAiChatIdFromProject(session.projectId)
            )
            
            transmitMessagesOnConnection(socket, projectChatsReference);

            registerChatEvents(socket, io, db, session, projectChatsReference);

            transmitEditionsStatusOnConnection(socket, session, editionRegister);

            registerEditionEvents(socket, session, editionRegister);

            // Join the room for the project (using in broadcast communicates for project)
            socket.join(socket.projectId);

            socket.onAny(async (eventName, ...args) => {
                /**
                 * This code will be executed for every event received by the socket.
                 */

                try {
                    const isMember = await db.isUserProjectMember(session.projectId, session.userId);
        
                    if (!isMember) {
                        logger.info("Disconnect user which is not a member of the project now.")
                        logger.info(`User id: ${session.userId}`);

                        socket.emit('error', 'You are not a member of the project.');
                        socket.disconnect();
                    }

                } catch (error) {
                    logger.error(`Cannot check if user is still a member of the project.`);
                    logger.error(`Details: ${error.message}`);
                    
                    socket.emit('error', 'INTERNAL SERVER ERROR');
                    socket.disconnect();
                }
            });
        
            socket.on('disconnect', () => {
                logger.info(`User disconnected`);
                logger.info(`socket id: ${socket.id}`);
            });


        } catch (error) {
            logger.error(`Cannot get chats from project ${socket.projectId}.`);
            logger.error(`Details: ${error.message}`);

            socket.emit('error', 'INTERNAL SERVER ERROR');
            socket.disconnect();
        }
    });


    io.on('connect_error', (error) => {
        logger.error(`Connection error: ${error.message}`);
    });
}
