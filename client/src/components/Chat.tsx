import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { socket as socketChats } from '@/utils/sockets';
import ChatTab from "./ChatTab";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { AiModels } from "@/utils/enums";
import { AITextModels } from "@/utils/enums";
import { getAiIdByName } from "@/utils/enums";
import { RequestType } from "@/utils/enums";
import { IoClose } from "react-icons/io5";
import axiosInstance from "@/services/api";
import { API_URLS } from "@/services/apiUrls";
import { useParams } from "react-router-dom";
import { useUser } from "./UserProvider";

interface ChatProps {
    isCollapsed: boolean;
    key_info: string
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


const Chat = ({ isCollapsed, key_info, onProjectClick }: ChatProps) => {
    const { projectID } = useParams();
    const { user } = useUser();

    const [unconfirmedMessagesAiChat, setUnconfirmedMessagesAiChat] = useState<string[]>([]);
    const [unconfirmedMessagesDiscussionChat, setUnconfirmedMessagesDiscussionChat] = useState<string[]>([]);

    const [messagesAiChat, setMessagesAiChat] = useState<Message[]>([]);
    const [messagesDiscussionChat, setMessagesDiscussionChat] = useState<Message[]>([]);

    const [loadOlderMessagesAiChat, setLoadOlderMessagesAiChat] = useState<LoadOlderMessages>('none');
    const [loadOlderMessagesDiscussionChat, setLoadOlderMessagesDiscussionChat] = useState<LoadOlderMessages>('none');

    const [selectedAi, setSelectedAi] = useState<AiModels>("gpt-35-turbo");

    type ActiveTab = "ai" | "discussion";
    const [activeTab, setActiveTab] = useState<ActiveTab>("ai");

    const [messageInput, setMessageInput] = useState<string>("");

    useEffect(() => {
        if (key_info === "ai") {
            handleSetActiveTab("ai");

        }
        else {
            handleSetActiveTab("discussion");

        }
    }, [key_info]);

    const [userData, setUserData] = useState<Members[] | null>(null);


    useEffect(() => {
        const fetchProjectData = async () => {
            try {

                const membersResponse = await axiosInstance.get(`${API_URLS.BASE_URL}/users/projects/${projectID}`);
                const usersData = membersResponse.data as Members[];

                setUserData(usersData);
            } catch (error) {
                console.error("Failed to fetch userData", error);
            }
            // finally {
            //     setLoading(false);
            // }
        };

        fetchProjectData();
    }, [projectID]);

    useEffect(() => {

        function onReceiveMessagesFromDiscussionChat(result: MessageResponse): void {
            loadMoreMessagesButtonService(result.olderMessagesExist, setLoadOlderMessagesDiscussionChat);
            handleReceivedMessage(result.messages, setMessagesDiscussionChat, setUnconfirmedMessagesDiscussionChat);
            updateOffset(result.messages, "discussion");
        }


        function onReceiveMessagesFromAiChat(result: MessageResponse): void {
            loadMoreMessagesButtonService(result.olderMessagesExist, setLoadOlderMessagesAiChat);
            handleReceivedMessage(result.messages, setMessagesAiChat, setUnconfirmedMessagesAiChat);
            updateOffset(result.messages, "ai");
        }


        function loadMoreMessagesButtonService(olderMessagesExist: boolean, setStateFun: React.Dispatch<React.SetStateAction<LoadOlderMessages>>,): void {
            if (olderMessagesExist === true) {
                setStateFun('display-load-button');
            }
            else if (olderMessagesExist === false) {
                setStateFun('none');
            }
        }


        socketChats.on('receive-message-from-discussion-chat', onReceiveMessagesFromDiscussionChat);
        socketChats.on('receive-message-from-ai-chat', onReceiveMessagesFromAiChat);

        return () => {
            socketChats.off('receive-message-from-discussion-chat', onReceiveMessagesFromDiscussionChat);
            socketChats.off('receive-message-from-ai-chat', onReceiveMessagesFromAiChat);
        };
    }, []);


    const handleSendMessage = () => {
        if (!messageInput || messageInput.trim() === "") return;

        const message = {
            content: messageInput,
        }

        if (activeTab === "ai") {
            unconfirmedMessagesAiChat.push(messageInput);

            const message = {
                content: messageInput,
                ai: getAiIdByName(selectedAi),
                component: null,
                requestType: RequestType.QUESTION,

            }

            socketChats.emit('send-message-to-ai-chat', message);
        }
        else {
            unconfirmedMessagesDiscussionChat.push(messageInput);
            socketChats.emit('send-message-to-discussion-chat', message);
        }

        setMessageInput("");
    };


    const handleReceivedMessage = (
        receivedMessages: Message[],
        setMessagesFun: React.Dispatch<React.SetStateAction<Message[]>>,
        setUnconfirmedMessagesFun: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        /**
         * 1. We search for messages we haven't received yet
         * 2. We add them to the list of messages and sort them by message_id
         * 3. We remove the message from the list of unconfirmed messages 
         */

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
            console.log("aj")
            socketChats.auth.aiChatOffset = maxMessageId;
        }
    };


    const handleSetActiveTab = (value: string) => {
        if (value === "ai" || value === "discussion") {
            setActiveTab(value as ActiveTab);
        }
    };


    const handleAiModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAi(event.target.value as AiModels);
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


    const getTheOldestMessage = (messages: Message[]): Message => {
        return messages.reduce((prev, current) => (prev.message_id < current.message_id) ? prev : current);
    }

    return (
        key_info ? (
            <div style={{ width: "25vw", height: "100%" }}>

                <div className="h-full w-full flex-col justify-center">
                    {isCollapsed && (
                        <>
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
                                            <option value="GPT3.5">GPT3.5</option>
                                            <option value="GPT4o">GPT4o</option>
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

                            {activeTab === 'ai' ? (
                                <ChatTab
                                    key="ai-chat"
                                    isAI={true}
                                    messages={messagesAiChat}
                                    unconfirmedMessages={unconfirmedMessagesAiChat}
                                    loadOlderMessages={loadOlderMessagesAiChat}
                                    onLoadMoreMessages={onLoadMoreMessagesAiChat}
                                    userData={userData}
                                />
                            ) : (
                                <></>
                            )}
                            {activeTab === 'discussion' ? (
                                <ChatTab
                                    key="discussion-chat"
                                    isAI={false}
                                    messages={messagesDiscussionChat}
                                    unconfirmedMessages={unconfirmedMessagesDiscussionChat}
                                    loadOlderMessages={loadOlderMessagesDiscussionChat}
                                    onLoadMoreMessages={onLoadMoreMessagesDiscussionChat}
                                    userData={userData}

                                />
                            ) : (
                                <></>
                            )}

                            <div className="w-full items-center bg-white">
                                <div className="messageBox">
                                    <textarea
                                        required
                                        placeholder="Message..."
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        id="messageInput"
                                        className="custom-textarea"
                                    />
                                    <button id="sendButton" onClick={handleSendMessage}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 664 663">
                                            <path
                                                fill="none"
                                                d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                                            ></path>
                                            <path
                                                stroke-linejoin="round"
                                                stroke-linecap="round"
                                                stroke-width="33.67"
                                                stroke="#6c6c6c"
                                                d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                                            ></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

        ) : (
            <></>
        )
    );
}
export default Chat;
