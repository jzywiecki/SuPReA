import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { socketChats } from '@/sockets';
import ChatTab from "./ChatTab";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";


const Chat = ({ isCollapsed, projectId, userId, userNick, authToken }) => {

    const [connected, setConnected] = useState(false);

    const [unconfirmedMessagesAiChat, setUnconfirmedMessagesAiChat] = useState([]);
    const [unconfirmedMessagesDiscussionChat, setUnconfirmedMessagesDiscussionChat] = useState([]);

    const [messagesAiChat, setMessagesAiChat] = useState([]);
    const [messagesDiscussionChat, setMessagesDiscussionChat] = useState([]);

    const [activeTab, setActiveTab] = useState("ai");

    const [messageInput, setMessageInput] = useState("");


    useEffect(() => {
        socketChats.auth = {
            projectId: projectId,
            userId: userId,
            token: 1,
            discussionChatOffset: 0,
            aiChatOffset: 0
        };

        socketChats.connect();


        function onConnect() {
            console.log("Connected to server.");
            setConnected(true);
        }


        function onDisconnect() {
            console.log("Disconnected from server.");
            setConnected(false);
        }


        function onConnectionError(err) {
            setConnected(false);
            console.log("[CONNECTION ERROR] " + err);
        }


        function onError(err) {
            console.log("[ERROR] " + err);
        }

        
        function onReceiveMessagesFromDiscussionChat(messages) {
            console.log("RECEIVED");
            console.log(messages);
            handleReceivedMessage(messages, setMessagesDiscussionChat, setUnconfirmedMessagesDiscussionChat);
            updateOffset(messages, "discussion");
        }


        function onReceiveMessagesFromAiChat(messages) {
            console.log("RECEIVED AI");
            console.log(messages);
            handleReceivedMessage(messages, setMessagesAiChat, setUnconfirmedMessagesAiChat);
            updateOffset(messages, "ai");
        }


        socketChats.on('connect', onConnect);
        socketChats.on('disconnect', onDisconnect);
        socketChats.on('connect_error', onConnectionError);
        socketChats.on('receive-message-from-discussion-chat', onReceiveMessagesFromDiscussionChat);
        socketChats.on('receive-message-from-ai-chat', onReceiveMessagesFromAiChat);
        socketChats.on('error', onError);

        return () => {
            socketChats.off('connect', onConnect);
            socketChats.off('disconnect', onDisconnect);
            socketChats.off('connect_error', onConnectionError);
            socketChats.disconnect();
        };
    }, []);


    const handleSendMessage = () => {
        if (!messageInput || messageInput.trim() === "")  return;

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


    const handleReceivedMessage = (receivedMessages, setMessages, setUnconfirmedMessages) => {
        setMessages(prevMessages => {
            const existingMessageIds = new Set(prevMessages.map(message => message.message_id));
    
            const newMessages = receivedMessages.filter(message => !existingMessageIds.has(message.message_id));
    
            if (newMessages.length === 0) {
                return prevMessages;
            }
    
            const updatedMessages = [...prevMessages, ...newMessages];
            updatedMessages.sort((a, b) => a.message_id - b.message_id);
    
            setUnconfirmedMessages(prevUnconfirmed => {
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


    const updateOffset = (messages, type) => {    
        const maxMessageId = messages.reduce((maxId, message) => {
            return message.message_id > maxId ? message.message_id : maxId;
        }, 0);
        if (type === "ai") {
            socketChats.auth.discussionChatOffset = maxMessageId;
        } else {
            socketChats.auth.aiChatOffset = maxMessageId;
        }
    };


    return (
        <div className="h-full w-full flex-col justify-center">
            {isCollapsed && (
                <>
                    <Tabs defaultValue="ai" onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2 h-10">
                            <TabsTrigger value="ai">AI Chat</TabsTrigger>
                            <TabsTrigger value="discussion">Discussion</TabsTrigger>
                        </TabsList>

                        <TabsContent value="ai">
                            <ChatTab key="ai-chat" userNick={userNick} messages={messagesAiChat} unconfirmedMessages={unconfirmedMessagesAiChat} />
                        </TabsContent>

                        <TabsContent value="discussion">
                            <ChatTab key="discussion-chat" userNick={userNick} messages={messagesDiscussionChat} unconfirmedMessages={unconfirmedMessagesDiscussionChat} />
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
