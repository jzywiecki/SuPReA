import ChatMessage from "@/components/ChatMessage";
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useState, useEffect, useRef, MutableRefObject } from "react";
import { Message, LoadOlderMessages } from "@/components/Chat";
import { useUser } from "@/components/UserProvider";
import { Button } from "./ui/button";


interface ChatTabProps {
    messages: Message[];
    unconfirmedMessages: string[];
    loadOlderMessages: LoadOlderMessages;
    onLoadMoreMessages: () => void;
}


const ChatTab = ({ isAI, messages, unconfirmedMessages, loadOlderMessages, onLoadMoreMessages, userData }: ChatTabProps) => {

    const [scrollHeight, setScrollHeight] = useState<number>(0);
    const [scrollTop, setScrollTop] = useState<number>(0);
    const [clientHeight, setClientHeight] = useState<number>(0);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const { user } = useUser();

    function useChatScroll<T>(deps: T): MutableRefObject<HTMLDivElement> {
        const ref = useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (ref.current && isAtBottom) {
                ref.current.scrollTop = ref.current.scrollHeight;
            }
        }, [deps, isAtBottom]);

        return ref;
    }

    const scrollRef = useChatScroll([messages, unconfirmedMessages]);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        setScrollHeight(scrollHeight);
        setScrollTop(scrollTop);
        setClientHeight(clientHeight);
        setIsAtBottom(scrollHeight - scrollTop - clientHeight < 20);
    };


    const findUserInfoById = (users, id) => {
        const user = users.find((user) => user.id === id);
        if (user) {
            return {
                username: user.username,
                avatarurl: user.avatarurl,
            };
        }
        return null;
    };


    return (
        <>
            <ScrollArea.Root className="scroll-area-root" style={{ height: 'calc(100vh - 100px - 4rem)', width: '100%' }}>
                <ScrollArea.Viewport className="scroll-area-viewport"
                    ref={scrollRef}
                    style={{ height: 'calc(100vh - 100px - 4rem)', width: '100%' }} //viewport - messeage box - header
                    onScrollCapture={handleScroll}

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

                    <div style={{ width: '100%' }}>
                        {messages.map((message, index) => {
                            const messageType = message.author === user.id ? "user" : "other";
                            return <ChatMessage key={index} isAI={isAI && !(message.author === user.id)} text={message.text} sender={message.author} date={message.date} messageType={messageType} senderInfo={findUserInfoById(userData, message.author)} confirmed={true} />;
                        })}

                        {unconfirmedMessages.map((message, index) => {
                            return <ChatMessage key={index} isAI={isAI && !(message.author === user.id)} text={message} sender={user.id} date={undefined} messageType="user" senderInfo={findUserInfoById(userData, message.author)} confirmed={false} />;
                        })}
                    </div>

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
