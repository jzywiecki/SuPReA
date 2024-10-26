import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { socket as socketChats } from '@/sockets';
import ChatTab from "./ChatTab";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";


interface ChatProps {
    isCollapsed: boolean;
    projectId: string;
    userId: string;
    userNick: string;
    authToken: string;
}


export interface Message {
    author: string;
    text: string;
    date: string;
    message_id: number;
}


export type LoadOlderMessages = 'display-load-button' | 'loading' | 'none';


const Chat = ({ isCollapsed, projectId, userId, userNick, authToken }: ChatProps) => {

    const [connected, setConnected] = useState<boolean>(false);

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
        
        function onReceiveMessagesFromDiscussionChat(messages: Message[]): void {
            handleReceivedMessage(messages, setMessagesDiscussionChat, setUnconfirmedMessagesDiscussionChat);
            updateOffset(messages, "discussion");
        }


        function onReceiveMessagesFromAiChat(messages: Message[]): void {
            handleReceivedMessage(messages, setMessagesAiChat, setUnconfirmedMessagesAiChat);
            updateOffset(messages, "ai");
        }


        function handleOlderMessagesOnDiscussionChat(moreMessage: boolean): void {
            if (moreMessage) {
                setLoadOlderMessagesDiscussionChat('display-load-button');
            } else {
                setLoadOlderMessagesDiscussionChat('none');
            }
        }


        function handleOlderMessagesOnAiChat(moreMessage: boolean): void {
            if (moreMessage) {
                setLoadOlderMessagesAiChat('display-load-button')
            } else {
                setLoadOlderMessagesAiChat('none');
            }
        }



        socketChats.on('receive-message-from-discussion-chat', onReceiveMessagesFromDiscussionChat);
        socketChats.on('receive-message-from-ai-chat', onReceiveMessagesFromAiChat);
        socketChats.on('receive-is-more-older-messages-on-discussion-chat', handleOlderMessagesOnDiscussionChat);
        socketChats.on('receive-is-more-older-messages-on-ai-chat', handleOlderMessagesOnAiChat);

        return () => {
            socketChats.off('receive-message-from-discussion-chat', onReceiveMessagesFromDiscussionChat);
            socketChats.off('receive-message-from-ai-chat', onReceiveMessagesFromAiChat);
            socketChats.off('receive-is-more-older-messages-on-discussion-chat', handleOlderMessagesOnAiChat);
            socketChats.off('receive-is-more-older-messages-on-ai-chat', handleOlderMessagesOnDiscussionChat);
            socketChats.disconnect();
        };
    }, []);


    const handleSendMessage = () => {
        if (!messageInput || messageInput.trim() === "") return;

        if (activeTab === "ai") {
            unconfirmedMessagesAiChat.push(messageInput);
            socketChats.emit('send-message-to-ai-chat', messageInput);
        }
        else {
            unconfirmedMessagesDiscussionChat.push(messageInput);
            socketChats.emit('send-message-to-discussion-chat', messageInput);
        }

        setMessageInput("");
    };


    const handleReceivedMessage = (
        receivedMessages: Message[],
        setMessagesFun: React.Dispatch<React.SetStateAction<Message[]>>,
        setUnconfirmedMessagesFun: React.Dispatch<React.SetStateAction<string[]>>
    ) => {

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
                            <ChatTab key="ai-chat" userNick={userNick} messages={messagesAiChat} unconfirmedMessages={unconfirmedMessagesAiChat} loadOlderMessages={loadOlderMessagesAiChat} onLoadMoreMessages={onLoadMoreMessagesAiChat} />
                        </TabsContent>

                        <TabsContent value="discussion">
                            <ChatTab key="discussion-chat" userNick={userNick} messages={messagesDiscussionChat} unconfirmedMessages={unconfirmedMessagesDiscussionChat} loadOlderMessages={loadOlderMessagesDiscussionChat} onLoadMoreMessages={onLoadMoreMessagesDiscussionChat} />
                        </TabsContent>
                    </Tabs>
                    <div className="w-full flex items-center bg-muted ">
                        <Textarea placeholder="Aa"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <Button className="m-2" onClick={handleSendMessage}>Send message</Button>
                    </div>

                    <div className="bg-muted text-center text-sm text-muted-foreground p-2 h-18">
                        {connected ? "Connected" : "No connection."}
                    </div>
                </>
            )}
        </div>
    );
}

export default Chat;
