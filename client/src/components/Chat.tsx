import { useState, useEffect } from "react";
import { socket as socketChats } from '@/utils/sockets';
import ChatTab from "./ChatTab";
import { AiModels } from "@/utils/enums";
import { getAiIdByName } from "@/utils/enums";
import { RequestType } from "@/utils/enums";
import { IoClose } from "react-icons/io5";
import axiosInstance from "@/services/api";
import { API_URLS } from "@/services/apiUrls";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Skeleton } from "./ui/skeleton";
import { set } from "react-hook-form";

interface ChatProps {
    isCollapsed: boolean;
    key_info: string;
    onProjectClick: (projectName: string | null) => void;
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

interface Members {
    username: string;
    id: string;
    name: string;
    email: string;
}

export type LoadOlderMessages = 'display-load-button' | 'loading' | 'none';
type ActiveTab = "ai" | "discussion";

const Chat = ({ key_info, onProjectClick }: ChatProps) => {
    const { projectID } = useParams<{ projectID: string }>();
    const { enqueueSnackbar } = useSnackbar();

    const [unconfirmedMessagesAiChat, setUnconfirmedMessagesAiChat] = useState<string[]>([]);
    const [unconfirmedMessagesDiscussionChat, setUnconfirmedMessagesDiscussionChat] = useState<string[]>([]);
    const [messagesAiChat, setMessagesAiChat] = useState<Message[]>([]);
    const [messagesDiscussionChat, setMessagesDiscussionChat] = useState<Message[]>([]);
    const [loadOlderMessagesAiChat, setLoadOlderMessagesAiChat] = useState<LoadOlderMessages>('none');
    const [loadOlderMessagesDiscussionChat, setLoadOlderMessagesDiscussionChat] = useState<LoadOlderMessages>('none');
    const [selectedAi, setSelectedAi] = useState<AiModels>("gpt-35-turbo");
    const [activeTab, setActiveTab] = useState<ActiveTab>("ai");
    const [messageInput, setMessageInput] = useState<string>("");
    const [userData, setUserData] = useState<Members[] | null>(null);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        setActiveTab(key_info === "ai" ? "ai" : "discussion");
    }, [key_info]);

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`${API_URLS.BASE_URL}/users/projects/${projectID}`);
                setUserData(response.data as Members[]);
            } catch (error) {
                enqueueSnackbar("Failed to fetch user data", { variant: "error" });
                console.error("Failed to fetch userData", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchProjectData();
    }, [projectID, enqueueSnackbar]);

    useEffect(() => {
        setLoading(true);

        socketChats.on('receive-message-from-discussion-chat', onReceiveMessagesFromDiscussionChat);
        // enqueueSnackbar("Team chat connected", { variant: "success" });


        socketChats.on('receive-message-from-ai-chat', onReceiveMessagesFromAiChat);
        // enqueueSnackbar("AI chat connected", { variant: "success" });

        setLoading(false);

        return () => {
            socketChats.off('receive-message-from-discussion-chat', onReceiveMessagesFromDiscussionChat);
            socketChats.off('receive-message-from-ai-chat', onReceiveMessagesFromAiChat);
        };
    }, []);

    const onReceiveMessagesFromDiscussionChat = (result: MessageResponse) => {
        handleLoadMoreMessages(result.olderMessagesExist, setLoadOlderMessagesDiscussionChat);
        handleReceivedMessage(result.messages, setMessagesDiscussionChat, setUnconfirmedMessagesDiscussionChat);
        updateOffset(result.messages, "discussion");

    };

    const onReceiveMessagesFromAiChat = (result: MessageResponse) => {
        handleLoadMoreMessages(result.olderMessagesExist, setLoadOlderMessagesAiChat);
        handleReceivedMessage(result.messages, setMessagesAiChat, setUnconfirmedMessagesAiChat);
        updateOffset(result.messages, "ai");
        // if (user?.id && !(result.messages[0].author === user.id)) {
        //     enqueueSnackbar("AI responded", { variant: "info" });
        // }
    };

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;
        const messageContent = messageInput.trim();

        const message = {
            content: messageContent,
            ai: activeTab === "ai" ? getAiIdByName(selectedAi) : null,
            component: null,
            requestType: activeTab === "ai" ? RequestType.QUESTION : undefined,
        };

        if (activeTab === "ai") {
            setUnconfirmedMessagesAiChat((prev) => [...prev, messageContent]);
            socketChats.emit('send-message-to-ai-chat', message);
        } else {
            setUnconfirmedMessagesDiscussionChat((prev) => [...prev, messageContent]);
            socketChats.emit('send-message-to-discussion-chat', message);
        }

        setMessageInput("");
    };

    const handleReceivedMessage = (
        receivedMessages: Message[],
        setMessagesFun: React.Dispatch<React.SetStateAction<Message[]>>,
        setUnconfirmedMessagesFun: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        setMessagesFun((prevMessages) => {
            const existingMessageIds = new Set(prevMessages.map((msg) => msg.message_id));
            const newMessages = receivedMessages.filter((msg) => !existingMessageIds.has(msg.message_id));

            if (!newMessages.length) return prevMessages;

            const updatedMessages = [...prevMessages, ...newMessages].sort((a, b) => a.message_id - b.message_id);

            setUnconfirmedMessagesFun((prev) => {
                return prev.filter((msg) => !newMessages.some((newMsg) => newMsg.text === msg));
            });

            return updatedMessages;
        });
    };

    const handleLoadMoreMessages = (
        olderMessagesExist: boolean,
        setState: React.Dispatch<React.SetStateAction<LoadOlderMessages>>
    ) => {
        setState(olderMessagesExist ? 'display-load-button' : 'none');
    };

    const updateOffset = (messages: Message[], type: ActiveTab) => {
        const maxMessageId = Math.max(...messages.map((msg) => msg.message_id));
        if (type === "ai") {
            socketChats.auth.aiChatOffset = maxMessageId;
        } else {
            socketChats.auth.discussionChatOffset = maxMessageId;
        }
    };

    const handleAiModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAi(event.target.value as AiModels);
    };

    const onLoadMoreMessagesDiscussionChat = () => {
        setLoadOlderMessagesDiscussionChat('loading');
        socketChats.emit('get-older-messages-from-discussion-chat', getOldestMessageId(messagesDiscussionChat));
    };

    const onLoadMoreMessagesAiChat = () => {
        setLoadOlderMessagesAiChat('loading');
        socketChats.emit('get-older-messages-from-ai-chat', getOldestMessageId(messagesAiChat));
    };

    const getOldestMessageId = (messages: Message[]) => {
        return messages.reduce((min, msg) => Math.min(min, msg.message_id), Infinity);
    };
    const SkeletonLoading = () => (
        <div style={{ width: "25vw", height: "100%" }}>
            <div className="h-full w-full flex-col justify-center">
                <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-lg font-semibold">
                            {activeTab === 'ai' ? 'AI Chat' : 'Team Chat'}
                        </h2>
                        {activeTab === 'ai' && (
                            <select
                                className="border rounded-md p-1 text-sm bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={selectedAi}
                                onChange={handleAiModelChange}
                            >
                                <option value="gpt-35-turbo">GPT3.5</option>
                                <option value="gpt-4o-mini">GPT4o</option>
                                <option value="llama-3.2">Llama3.2</option>
                            </select>
                        )}
                    </div>
                    <button
                        onClick={() => onProjectClick(null)}
                        aria-label="Close chat"
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <IoClose size={24} />
                    </button>
                </div>
            </div>
            <div className="flex justify-center items-around p-3" style={{ width: "25vw", height: "100%" }}>
                <div className="w-[85%] space-y-3">
                    <Skeleton className="h-80 " />
                    <Skeleton className="h-20 " />
                    <Skeleton className="h-20 " />
                </div>

            </div>
        </div>
    );
    if (loading) return < SkeletonLoading />;
    return key_info ? (
        <div style={{ width: "25vw", height: "100%" }}>
            <div className="h-full w-full flex-col justify-center">
                <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-lg font-semibold">
                            {activeTab === 'ai' ? 'AI Chat' : 'Team Chat'}
                        </h2>
                        {activeTab === 'ai' && (
                            <select
                                className="border rounded-md p-1 text-sm bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={selectedAi}
                                onChange={handleAiModelChange}
                            >
                                <option value="gpt-35-turbo">GPT3.5</option>
                                <option value="gpt-4o-mini">GPT4o</option>
                                <option value="llama-3.2">Llama3.2</option>
                            </select>
                        )}
                    </div>
                    <button
                        onClick={() => onProjectClick(null)}
                        aria-label="Close chat"
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <IoClose size={24} />
                    </button>
                </div>
                <ChatTab
                    isAI={activeTab === 'ai'}
                    messages={activeTab === 'ai' ? messagesAiChat : messagesDiscussionChat}
                    unconfirmedMessages={activeTab === 'ai' ? unconfirmedMessagesAiChat : unconfirmedMessagesDiscussionChat}
                    loadOlderMessages={activeTab === 'ai' ? loadOlderMessagesAiChat : loadOlderMessagesDiscussionChat}
                    onLoadMoreMessages={activeTab === 'ai' ? onLoadMoreMessagesAiChat : onLoadMoreMessagesDiscussionChat}
                    userData={userData}
                />
                <div className="w-full items-center bg-white">
                    <div className="messageBox">
                        <textarea
                            placeholder="Message..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            id="messageInput"
                            className="custom-textarea"
                        />
                        <button id="sendButton" onClick={handleSendMessage}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 664 663">
                                <path fill="none" d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"></path>
                                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="33.67" stroke="#6c6c6c" d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
};

export default Chat;
