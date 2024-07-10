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


        socketChats.on('connect', onConnect);
        socketChats.on('disconnect', onDisconnect);
        socketChats.on('connect_error', onConnectionError);
        socketChats.on('error', onError);

        return () => {
            socketChats.off('connect', onConnect);
            socketChats.off('disconnect', onDisconnect);
            socketChats.off('connect_error', onConnectionError);
            socketChats.disconnect();
        };
    }, []);

    const handleSendMessage = () => {
        if (!messageInput) return;

        if (activeTab === "ai") {
            unconfirmedMessagesAiChat.push(messageInput);
        }
        else {
            unconfirmedMessagesDiscussionChat.push(messageInput);
        }

        setMessageInput("");
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
                            <ChatTab key="ai-chat" messages={messagesAiChat} unconfirmedMessages={unconfirmedMessagesAiChat} />
                        </TabsContent>

                        <TabsContent value="discussion">
                            <ChatTab key="discussion-chat" messages={messagesDiscussionChat} unconfirmedMessages={unconfirmedMessagesDiscussionChat} />
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
