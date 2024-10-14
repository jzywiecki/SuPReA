import { transmitMessagesOnConnection } from './chat.js';
import { registerChatEvents } from './chat.js';
import { ObjectId } from 'mongodb';
import { ProjectChatsReference } from './chat.js';


export class Session {
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

            registerChatEvents(socket, session, projectChatsReference);

            socket.join(socket.projectId);

            socket.onAny(async (eventName, ...args) => {

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
