import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { socket as socketChats } from '@/sockets';
import ChatTab from "./ChatTab";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";


interface ChatProps {
    isCollapsed: boolean;
}


export interface Message {
    author: string;
    text: string;
    date: string;
    message_id: number;
}


interface MessageResponse {
    messages: Message[];
    olderMessagesExist: boolean;
}


export type LoadOlderMessages = 'display-load-button' | 'loading' | 'none';


const Chat = ({ isCollapsed }: ChatProps) => {


    const [unconfirmedMessagesAiChat, setUnconfirmedMessagesAiChat] = useState<string[]>([]);
    const [unconfirmedMessagesDiscussionChat, setUnconfirmedMessagesDiscussionChat] = useState<string[]>([]);

    const [messagesAiChat, setMessagesAiChat] = useState<Message[]>([]);
    const [messagesDiscussionChat, setMessagesDiscussionChat] = useState<Message[]>([]);

    const [loadOlderMessagesAiChat, setLoadOlderMessagesAiChat] = useState<LoadOlderMessages>('none');
    const [loadOlderMessagesDiscussionChat, setLoadOlderMessagesDiscussionChat] = useState<LoadOlderMessages>('none');

    type ActiveTab = "ai" | "discussion";
    const [activeTab, setActiveTab] = useState<ActiveTab>("ai");

    const [messageInput, setMessageInput] = useState<string>("");


    useEffect(() => {

        function onReceiveMessagesFromDiscussionChat(result: MessageResponse): void {
            loadMoreMessagesButtonService(result.olderMessagesExist, setLoadOlderMessagesDiscussionChat);
            handleReceivedMessage(result.messages, setMessagesDiscussionChat, setUnconfirmedMessagesDiscussionChat);
            updateOffset(result.messages, "discussion");
        }


        function onReceiveMessagesFromAiChat(result: MessageResponse): void {
            loadMoreMessagesButtonService(result.olderMessagesExist, setLoadOlderMessagesAiChat);
            handleReceivedMessage(result.messages, setMessagesAiChat, setUnconfirmedMessagesAiChat);
            updateOffset(result.messages, "ai");
        }


        function loadMoreMessagesButtonService(olderMessagesExist: boolean, setStateFun: React.Dispatch<React.SetStateAction<LoadOlderMessages>>, ): void {
            if (olderMessagesExist === true) {
                setStateFun('display-load-button');
            }
            else if (olderMessagesExist === false) {
                setStateFun('none');
            }
        }


        socketChats.on('receive-message-from-discussion-chat', onReceiveMessagesFromDiscussionChat);
        socketChats.on('receive-message-from-ai-chat', onReceiveMessagesFromAiChat);

        return () => {
            socketChats.off('receive-message-from-discussion-chat', onReceiveMessagesFromDiscussionChat);
            socketChats.off('receive-message-from-ai-chat', onReceiveMessagesFromAiChat);
        };
    }, []);


    const handleSendMessage = () => {
        if (!messageInput || messageInput.trim() === "") return;

        const message = {
            content: messageInput,
        }

        if (activeTab === "ai") {
            unconfirmedMessagesAiChat.push(messageInput);
            socketChats.emit('send-message-to-ai-chat', message);
        }
        else {
            unconfirmedMessagesDiscussionChat.push(messageInput);
            socketChats.emit('send-message-to-discussion-chat', message);
        }

        setMessageInput("");
    };


    const handleReceivedMessage = (
        receivedMessages: Message[],
        setMessagesFun: React.Dispatch<React.SetStateAction<Message[]>>,
        setUnconfirmedMessagesFun: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        /**
         * 1. We search for messages we haven't received yet
         * 2. We add them to the list of messages and sort them by message_id
         * 3. We remove the message from the list of unconfirmed messages 
         */

        setMessagesFun(prevMessages => {
            const existingMessageIds = new Set(prevMessages.map(message => message.message_id));

            const newMessages = receivedMessages.filter(message => !existingMessageIds.has(message.message_id));

            if (newMessages.length === 0) {
                return prevMessages;
            }

            const updatedMessages = [...prevMessages, ...newMessages];
            updatedMessages.sort((a, b) => a.message_id - b.message_id);

            setUnconfirmedMessagesFun(prevUnconfirmed => {
                const updatedUnconfirmed = [...prevUnconfirmed];
                newMessages.forEach(receivedMessage => {
                    const index = updatedUnconfirmed.indexOf(receivedMessage.text);
                    if (index !== -1) {
                        updatedUnconfirmed.splice(index, 1);
                    }
                });
                return updatedUnconfirmed;
            });

            return updatedMessages;
        });
    };


    const updateOffset = (messages: Message[], type: ActiveTab) => {
        const maxMessageId = messages.reduce((maxId, message) => {
            return message.message_id > maxId ? message.message_id : maxId;
        }, 0);
        if (type === "ai") {
            socketChats.auth.discussionChatOffset = maxMessageId;
        } else {
            socketChats.auth.aiChatOffset = maxMessageId;
        }
    };


    const handleSetActiveTab = (value: string) => {
        if (value === "ai" || value === "discussion") {
            setActiveTab(value as ActiveTab);
        }
    };


    const onLoadMoreMessagesDiscussionChat = () => {
        setLoadOlderMessagesDiscussionChat('loading');
        const oldestMessage = getTheOldestMessage(messagesDiscussionChat);
        socketChats.emit('get-older-messages-from-discussion-chat', oldestMessage.message_id);
    }


    const onLoadMoreMessagesAiChat = () => {
        setLoadOlderMessagesAiChat('loading');
        const oldestMessage = getTheOldestMessage(messagesAiChat);
        socketChats.emit('get-older-messages-from-ai-chat', oldestMessage.message_id);
    }


    const getTheOldestMessage = (messages : Message[]) : Message => {
        return messages.reduce((prev, current) => (prev.message_id < current.message_id) ? prev : current);
    }


    return (
        <div className="h-full w-full flex-col justify-center">
            {isCollapsed && (
                <>
                    <Tabs defaultValue="ai" onValueChange={handleSetActiveTab}>
                        <TabsList className="grid w-full grid-cols-2 h-10">
                            <TabsTrigger value="ai">AI Chat</TabsTrigger>
                            <TabsTrigger value="discussion">Discussion</TabsTrigger>
                        </TabsList>
    
                        <TabsContent value="ai">
                            <ChatTab 
                                key="ai-chat" 
                                messages={messagesAiChat} 
                                unconfirmedMessages={unconfirmedMessagesAiChat} 
                                loadOlderMessages={loadOlderMessagesAiChat} 
                                onLoadMoreMessages={onLoadMoreMessagesAiChat} 
                            />
                        </TabsContent>
    
                        <TabsContent value="discussion">
                            <ChatTab 
                                key="discussion-chat" 
                                messages={messagesDiscussionChat} 
                                unconfirmedMessages={unconfirmedMessagesDiscussionChat} 
                                loadOlderMessages={loadOlderMessagesDiscussionChat} 
                                onLoadMoreMessages={onLoadMoreMessagesDiscussionChat} 
                            />
                        </TabsContent>
                    </Tabs>
    
                    <div className="w-full items-center bg-white">
                        <Textarea
                            placeholder="Aa"
                            className="h-1"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <div className="flex items-center mt-2">
                            <Button onClick={handleSendMessage}>Send message</Button>
                            {activeTab === "ai" && ( // Warunkowe renderowanie dropdownu
                                <select className="ml-2 border rounded p-1">
                                    <option value="GPT3.5">GPT3.5</option>
                                    <option value="GPT4.0">GPT4o</option>
                                </select>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
    
}

export default Chat;
