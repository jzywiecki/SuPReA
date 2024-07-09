import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatMessage from "@/components/ChatMessage";
import { Button } from "./ui/button";
import { Textarea } from "@/components/ui/textarea";
import * as ScrollArea from '@radix-ui/react-scroll-area';
import React from "react";
import { useEffect, useState } from "react";

const Chat = ({ isCollapsed, projectId, senderId }) => {

    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);

    // max constraint height
    const [scrollChatHeight, setScrollChatHeight] = useState(0); 
    const [scrollAiChatHeight, setScrollAiChatHeight] = useState(0);

    // current scroll Y position
    const [scrollChatTop, setScrollChatTop] = useState(0);
    const [scrollAiChatTop, setScrollAiChatTop] = useState(0);

    // height of visible area
    const [clientChatHeight, setClientChatHeight] = useState(0);
    const [clientAiChatHeight, setClientAiChatHeight] = useState(0);

    
    function useChatScroll<T>(dep: T): React.MutableRefObject<HTMLDivElement> {
        const ref = React.useRef<HTMLDivElement>();
        React.useEffect(() => {
          if (ref.current && scrollAiChatHeight - scrollAiChatTop == clientAiChatHeight) {
            ref.current.scrollTop = ref.current.scrollHeight;
          }
        }, [dep]);
        return ref;
    }

    const scrollAiRef = useChatScroll(messages);


    return (
        <div className="h-full w-full flex-col justify-center">
            {isCollapsed && (
                <>
                    <Tabs defaultValue="ai">
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
                                {messages.map((message) => (
                                    <ChatMessage key={message.id} message={message} id={message.id} />
                                ))}
                            </ScrollArea.Viewport>
                            <ScrollArea.Scrollbar className="scroll-area-scrollbar" orientation="vertical">
                                <ScrollArea.Thumb className="scroll-area-thumb" />
                            </ScrollArea.Scrollbar>
                            <ScrollArea.Corner className="scroll-area-corner" />
                        </ScrollArea.Root>


                            </TabsContent>
                        <TabsContent value="discussion">
                            <ScrollArea onScrollCapture={ (event) => {
                                    setScrollChatHeight(event.target.scrollHeight);
                                    setScrollChatTop(event.target.scrollTop);
                                    setClientChatHeight(event.target.clientHeight);
                            }} 
                                style={{ height: 'calc(92vh - 68*4px)'} 
                            }>
                                siema
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                    
                    <div className="w-full flex items-center bg-muted ">
                        <Textarea placeholder="Aa" />
                        <Button className="m-2">Send message</Button>
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
