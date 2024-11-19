import ChatMessage from "@/components/ChatMessage";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useState, useEffect, useRef, MutableRefObject } from "react";
import { Message, LoadOlderMessages } from "@/components/Chat";
import { useUser } from "@/components/UserProvider";
import { Button } from "./ui/button";
import { useSnackbar } from 'notistack';

interface ChatTabProps {
    isAI: boolean;
    messages: Message[];
    unconfirmedMessages: string[];
    loadOlderMessages: LoadOlderMessages;
    onLoadMoreMessages: () => void;
    userData: UserData[];
}

interface Members {
    username: string;
    id: string;
    name: string;
    email: string;
}
interface UserData extends Members {

    avatarurl?: string;
}

const AI_ID = "651ffd7ac0f14c3aaf123456"

const ChatTab = ({ isAI, messages, unconfirmedMessages, loadOlderMessages, onLoadMoreMessages, userData }: ChatTabProps) => {
    const [isAtBottom, setIsAtBottom] = useState(true);

    const { user } = useUser();
    const { enqueueSnackbar } = useSnackbar();

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
        setIsAtBottom(scrollHeight - scrollTop - clientHeight < 20);
    };

    const findUserInfoById = (users: UserData[], id: string) => {
        if (id === AI_ID) {
            return {
                username: "AI",
                avatarurl: "AI",
            };
        }

        const user_ = users.find((user) => user.id === id);
        if (user_) {
            return {
                username: user_.username,
                avatarurl: user_.avatarurl,
            };
        } else {
            enqueueSnackbar("User not found", { variant: "error" });
            return { username: "Unknown", avatarurl: "" };
        }
    };

    return (
        <ScrollArea.Root
            className="scroll-area-root"
            style={{ height: "calc(100vh - 100px - 4rem)", width: "100%" }}
        >
            <ScrollArea.Viewport
                className="scroll-area-viewport"
                ref={scrollRef}
                style={{ height: "calc(100vh - 100px - 4rem)", width: "100%" }}
                onScrollCapture={handleScroll}
            >
                {loadOlderMessages === "display-load-button" && (
                    <div className="flex justify-center items-center m-2">
                        <Button
                            onClick={onLoadMoreMessages}
                            className="text-xs py-0.5 px-1 h-8 bg-gray-300 text-gray-700 hover:bg-gray-400"
                        >
                            Load more messages
                        </Button>
                    </div>
                )}

                {loadOlderMessages === "loading" && (
                    <div className="flex justify-center items-center m-2">
                        <span className="text-xs text-gray-700">Loading...</span>
                    </div>
                )}

                <div style={{ width: "100%" }}>
                    {messages.map((message, index) => {
                        const messageType = message.author === user.id ? "user" : "other";
                        const senderInfo = findUserInfoById(userData, message.author);
                        return (
                            <ChatMessage
                                key={index}
                                isAI={isAI && !(message.author === user.id)}
                                text={message.text}
                                sender={message.author}
                                date={message.date}
                                messageType={messageType}
                                senderInfo={senderInfo}
                                confirmed={true}
                            />
                        );
                    })}

                    {unconfirmedMessages.map((message, index) => {
                        const senderInfo = findUserInfoById(userData, user.id);
                        return (
                            <ChatMessage
                                key={`unconfirmed-${index}`}
                                isAI={isAI}
                                text={message}
                                sender={user.id}
                                date={undefined}
                                messageType="user"
                                senderInfo={senderInfo}
                                confirmed={false}
                            />
                        );
                    })}
                </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar className="scroll-area-scrollbar" orientation="vertical">
                <ScrollArea.Thumb className="scroll-area-thumb" />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner className="scroll-area-corner" />
        </ScrollArea.Root>
    );
};

export default ChatTab;
