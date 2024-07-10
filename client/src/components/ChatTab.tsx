import ChatMessage from "@/components/ChatMessage";
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useState, useEffect, useRef } from "react";
import { socketChats } from '@/sockets';


const ChatTab = ({ messages, unconfirmedMessages, userNick }) => {

    const [scrollHeight, setScrollHeight] = useState(0);
    const [scrollTop, setScrollCTop] = useState(0);
    const [clientHeight, setClientHeight] = useState(0);

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
                    {messages.map((message, index) => {
                        const styleId = message.author === userNick ? 2 : 1;
                        return <ChatMessage key={index} text={message.text} sender={message.author} date={message.date} styleId={styleId} confirmed={true} />;
                    })}
                    {unconfirmedMessages.map((message, index) => {
                        return <ChatMessage key={index} text={message} styleId={2} confirmed={false} date={null} sender={userNick}/>;
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
