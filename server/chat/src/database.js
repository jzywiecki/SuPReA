import { MongoClient, ObjectId } from 'mongodb';


const URL = 'mongodb://localhost:27017';
const DATABASE_NAME = 'test-inzynierka';

class Database {
    
    constructor() {
        this.client = new MongoClient(URL);
        this.db = this.client.db(DATABASE_NAME);
        this.chatCollection = this.db.collection('chats');
        this.projectCollection = this.db.collection('projects');
    }
    

    async close() {
        await this.client.close();
    }


    async addMessage(projectId, chatId, text, senderId) {
        //const session = this.client.startSession();
        let result = null;
    
        try {
            //session.startTransaction();

            const project = await this.projectCollection.findOne(
                {
                  _id: projectId,
                  $or: [
                    { chat_id: chatId },
                    { ai_chat_id: chatId }
                  ]
                },
                {
                  projection: { _id: 1 }
                }
                //{ session }
            );

            if (!project) {
                throw new Error('Chats does not belong to the project.');
            }
        
    
            const chat = await this.chatCollection.findOne(
                { _id: chatId },
                { projection: { _id: 0, last_message_id: 1 } }
                //{ session }
              );

            const lastMessageId = chat.last_message_id || 0;
        
            const newMessage = {
                author: senderId,
                text: text,
                date: new Date(),
                message_id: lastMessageId + 1
            };
        
            await this.chatCollection.updateOne(
                { _id: chatId },
                { 
                  $push: { messages: newMessage },
                  $set: { last_message_id: lastMessageId + 1 }
                },
                //{ session }
              );

            //await session.commitTransaction();
        
            result = {
                newMessage
            };
        } catch (error) {
            //await session.abortTransaction();
            throw error;
        } finally {
            //await session.endSession();
        }
    
        return result;
    }

    async isUserProjectMember(projectId, userId) {
        
        const project = await this.projectCollection.findOne({
            _id: ObjectId(projectId),
            members: { $elemMatch: { $eq: ObjectId(userId) } }
        });
    
        return project !== null;
    }


    async getNewestMessages(chatId, quantity) {
        const chat = await this.chatCollection.aggregate([
            { $match: { _id: chatId } },
            { $unwind: "$messages" },
            { $sort: { "messages.message_id": -1 } },
            { $limit: quantity },
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$messages" }
                }
            }
        ]).toArray();

        return chat.length > 0 ? chat[0].messages.reverse() : [];
    }


    async getOlderMessages(chatId, lastMessageId, quantity) {
        const chat = await this.chatCollection.aggregate([
            { $match: { _id: chatId } },
            {
                $project: {
                    messages: {
                        $filter: {
                            input: "$messages",
                            as: "message",
                            cond: { $lt: ["$$message.message_id", lastMessageId] }
                        }
                    }
                }
            },
            { $unwind: "$messages" },
            { $sort: { "messages.message_id": -1 } },
            { $limit: quantity },
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$messages" }
                }
            }
        ]).toArray();

        return chat.length > 0 ? chat[0].messages.reverse() : [];
    }


    async getNewerMessages(chatId, lastMessageId) {
        const chat = await this.chatCollection.findOne(
            { _id: chatId },
            {
                projection: {
                    messages: {
                        $filter: {
                            input: "$messages",
                            as: "message",
                            cond: { $gt: ["$$message.message_id", lastMessageId] }
                        }
                    }
                }
            }
        );

        return chat ? chat.messages : [];
    }


    async getGeneralChatIdFromProject(projectId) {
        return await this.projectCollection
            .findOne({ _id: projectId }, {projection:{ _id: 0, chat_id: 1 }})
    }


    async getAiChatIdFromProject(projectId) {
        return await this.projectCollection
            .findOne({ _id: projectId }, {projection:{ _id: 0, ai_chat_id: 1 }})
    }

}

export default Database;