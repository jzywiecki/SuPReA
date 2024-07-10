import ChatMessage from "@/components/ChatMessage";
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useState, useEffect, useRef, MutableRefObject } from "react";
import { Message, LoadOlderMessages } from "@/components/Chat";
import { Button } from "./ui/button";


interface ChatTabProps {
    messages: Message[];
    unconfirmedMessages: string[];
    userNick: string;
    loadOlderMessages: LoadOlderMessages;
    onLoadMoreMessages: () => void;
}


const ChatTab = ({ messages, unconfirmedMessages, userNick, loadOlderMessages, onLoadMoreMessages }: ChatTabProps) => {

    const [scrollHeight, setScrollHeight] = useState<number>(0);
    const [scrollTop, setScrollCTop] = useState<number>(0);
    const [clientHeight, setClientHeight] = useState<number>(0);

    function useChatScroll<T>(deps: T): MutableRefObject<HTMLDivElement> {
        const ref = useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (ref.current && scrollHeight - scrollTop === clientHeight) {
                ref.current.scrollTop = ref.current.scrollHeight;
            }
        }, [deps]);

        return ref;
    }

    const scrollRef = useChatScroll([messages, unconfirmedMessages]);


    return (
        <>
            <ScrollArea.Root className="scroll-area-root" style={{ height: 'calc(92vh - 68*4px)' }}>
                <ScrollArea.Viewport className="scroll-area-viewport"
                    ref={scrollRef}
                    style={{ height: 'calc(92vh - 68*4px)' }}
                    onScrollCapture={(event) => {
                        setScrollHeight(event.target.scrollHeight);
                        setScrollCTop(event.target.scrollTop);
                        setClientHeight(event.target.clientHeight);
                    }}
                >
                    {loadOlderMessages === 'display-load-button' && (
                        <div className="flex justify-center items-center m-2">
                            <Button onClick={onLoadMoreMessages} className="text-xs py-0.5 px-1 h-8 bg-gray-300 text-gray-700 hover:bg-gray-400">
                                Load more messages
                            </Button>
                        </div>
                    )}

                    {loadOlderMessages === 'loading' && (
                        <div className="flex justify-center items-center m-2">
                            <span className="text-xs text-gray-700">Loading...</span>
                        </div>
                    )}

                    {messages.map((message, index) => {
                        const messageType = message.author === userNick ? "user" : "other";
                        return <ChatMessage key={index} text={message.text} sender={message.author} date={message.date} messageType={messageType} confirmed={true} />;
                    })}

                    {unconfirmedMessages.map((message, index) => {
                        return <ChatMessage key={index} text={message} sender={userNick} date={undefined} messageType="user" confirmed={false} />;
                    })}
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar className="scroll-area-scrollbar" orientation="vertical">
                    <ScrollArea.Thumb className="scroll-area-thumb" />
                </ScrollArea.Scrollbar>
                <ScrollArea.Corner className="scroll-area-corner" />
            </ScrollArea.Root>
        </>
    );
}

export default ChatTab;
