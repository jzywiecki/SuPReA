import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatMessage from "@/components/ChatMessage";
import { Button } from "./ui/button";
import { Textarea } from "@/components/ui/textarea";
import * as ScrollArea from '@radix-ui/react-scroll-area';
import React from "react";
import { useState, useEffect } from "react";
import { socketChats } from '@/sockets';


const Chat = ({ isCollapsed, projectId, userId, authToken }) => {

    const [connected, setConnected] = useState(false);
    
    const [messagesAi, setMessagesAi] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeTab, setActiveTab] = useState("ai");
    const [messageInput, setMessageInput] = useState("");

    // max constraint height
    const [scrollChatHeight, setScrollChatHeight] = useState(0); 
    const [scrollAiChatHeight, setScrollAiChatHeight] = useState(0);

    // current scroll Y position
    const [scrollChatTop, setScrollChatTop] = useState(0);
    const [scrollAiChatTop, setScrollAiChatTop] = useState(0);

    // height of visible area
    const [clientChatHeight, setClientChatHeight] = useState(0);
    const [clientAiChatHeight, setClientAiChatHeight] = useState(0);

    
    function useAiChatScroll<T>(dep: T): React.MutableRefObject<HTMLDivElement> {
        const ref = React.useRef<HTMLDivElement>();
        React.useEffect(() => {
          if (ref.current && scrollAiChatHeight - scrollAiChatTop == clientAiChatHeight) {
            ref.current.scrollTop = ref.current.scrollHeight;
          }
        }, [dep]);
        return ref;
    }


    function useChatScroll<T>(dep: T): React.MutableRefObject<HTMLDivElement> {
        const ref = React.useRef<HTMLDivElement>();
        React.useEffect(() => {
          if (ref.current && scrollChatHeight - scrollChatTop == clientChatHeight) {
            ref.current.scrollTop = ref.current.scrollHeight;
          }
        }, [dep]);
        return ref;
    }

    const scrollAiRef = useAiChatScroll(messagesAi);
    const scrollRef = useChatScroll(messages);

    const handleSendMessage = () => {
        if (!messageInput) return;
        const newMessage = { text: messageInput, sender: senderId, confirmed: false };
        if (activeTab === "ai") {
            setMessagesAi((prevMessages) => [...prevMessages, newMessage]);
        } else {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
        setMessageInput("");
    };


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


        function onReceiveMessageFromChat(receivedMessages) {

            const newMessages = receivedMessages.map((message) => {
                return { ...message, confirmed: true };
            });

            
        }


        function onReceiveMessageFromAiChat(message) {
            //TODO
        }


        function onReceiveOlderMessagesFromChat(messages) {
            //TODO
        }


        function onReceiveOlderMessagesFromAiChat(messages) {
            //TODO
        }

    
        socketChats.on('connect', onConnect);
        socketChats.on('disconnect', onDisconnect);
        socketChats.on('connect_error', onConnectionError);
        socketChats.on('error', onError);
        socketChats.on('receive-message-from-general-chat', onReceiveMessageFromChat);
        socketChats.on('receive-message-from-ai-chat', onReceiveMessageFromAiChat);
        socketChats.on('receive-older-messages-from-general-chat', onReceiveOlderMessagesFromChat);
        socketChats.on('receive-older-messages-from-ai-chat', onReceiveOlderMessagesFromAiChat)
    
        return () => {
          socketChats.off('connect', onConnect);
          socketChats.off('disconnect', onDisconnect);
          socketChats.off('connect_error', onConnectionError);
          socketChats.off('receive-message-from-general-chat', onReceiveMessageFromChat);
          socketChats.off('receive-message-from-ai-chat', onReceiveMessageFromAiChat);
          socketChats.off('receive-older-messages-from-general-chat', onReceiveOlderMessagesFromChat);
          socketChats.off('receive-older-messages-from-ai-chat', onReceiveOlderMessagesFromAiChat);
          socketChats.disconnect();
        };
      }, []);


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
                            <ScrollArea.Root className="scroll-area-root" style={{ height: 'calc(92vh - 68*4px)' }}>
                                <ScrollArea.Viewport className="scroll-area-viewport" 
                                    ref={scrollAiRef} 
                                    style={{ height: 'calc(92vh - 68*4px)' }}
                                    onScrollCapture={(event) => {
                                        setScrollAiChatHeight(event.target.scrollHeight);
                                        setScrollAiChatTop(event.target.scrollTop);
                                        setClientAiChatHeight(event.target.clientHeight);
                                    }}>
                                {messagesAi.map((message, index) => {
                                    const id = message.sender === senderId ? 0 : 1;
                                    return <ChatMessage key={index} message={message} id={id} />;
                                })}
                                </ScrollArea.Viewport>
                                <ScrollArea.Scrollbar className="scroll-area-scrollbar" orientation="vertical">
                                    <ScrollArea.Thumb className="scroll-area-thumb" />
                                </ScrollArea.Scrollbar>
                                <ScrollArea.Corner className="scroll-area-corner" />
                            </ScrollArea.Root>
                        </TabsContent>

                        <TabsContent value="discussion">
                            <ScrollArea.Root className="scroll-area-root" style={{ height: 'calc(92vh - 68*4px)' }}>
                                <ScrollArea.Viewport className="scroll-area-viewport" 
                                    ref={scrollRef} 
                                    style={{ height: 'calc(92vh - 68*4px)' }}
                                    onScrollCapture={(event) => {
                                        setScrollChatHeight(event.target.scrollHeight);
                                        setScrollChatTop(event.target.scrollTop);
                                        setClientChatHeight(event.target.clientHeight);
                                    }}>
                                {messages.map((message, index) => {
                                    const id = message.sender === senderId ? 0 : 1;
                                    return <ChatMessage key={index} message={message} id={id} />;
                                })}
                                </ScrollArea.Viewport>
                                <ScrollArea.Scrollbar className="scroll-area-scrollbar" orientation="vertical">
                                    <ScrollArea.Thumb className="scroll-area-thumb" />
                                </ScrollArea.Scrollbar>
                                <ScrollArea.Corner className="scroll-area-corner" />
                            </ScrollArea.Root>
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
