import { ObjectId, BSONError } from "mongodb";
import { logger } from "./utils.js";
import { UserIsNotProjectMemberException } from "./exceptions.js";


export const authenticationMiddleware = (io, db) => {
    /**
     * Middleware executed during the handshake of the socket connection.
     * If the user is not a member of the project, the connection is rejected.
     * The middleware is executed exactly once before the connection is established.
     * During reconnection, the middleware is not executed.
     *
     * @param {Socket.io} io - Socket.io server instance.
     * @param {Database} db - Database instance
     */

    io.use(async (socket, next) => { 

        try {
            const userId = socket?.handshake?.auth?.userId;
            const projectId = socket?.handshake?.auth?.projectId;
    
            const isProjectMember = await db.isUserIsProjectMember(
                ObjectId.createFromHexString(projectId),
                ObjectId.createFromHexString(userId)
            ); 
    
            if (!isProjectMember) {
                throw new UserIsNotProjectMemberException("User is not a member of the project");
            }

            next();
        }

        catch (error) {
            
            if (error instanceof UserIsNotProjectMemberException || error instanceof BSONError) {
                logger.info("Rejected user during handshake.")
                logger.info(`Details: ${error.message}`)

                if (error instanceof BSONError) {
                    logger.info("Invalid handshake auth parameters.")
                }

                if (error instanceof UserIsNotProjectMemberException) {
                    logger.info("User is not a member of the project.")
                }

                next(error);
            } else {
                logger.error("Adapter Execution Failure")
                logger.error(`Details: ${error.message}`)
                next(new Error("INTERNAL SERVER ERROR"));
            }
        }
    });
}
