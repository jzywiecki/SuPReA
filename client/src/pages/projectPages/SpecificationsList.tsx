import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "@/services/api";
import { API_URLS } from "@/services/apiUrls";
import { IoCloseSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { FaCheck, FaTrash, FaHeart, FaRegHeart } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import { Skeleton } from "@/components/ui/skeleton";
import { TfiPaintBucket } from "react-icons/tfi";
import { Separator } from "@/components/ui/separator";
import { FaEdit } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { MdOutlineSwitchAccessShortcutAdd } from "react-icons/md";
import { LuPocketKnife } from "react-icons/lu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useUser } from "@/components/UserProvider";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { PiPaperPlaneRightFill } from "react-icons/pi";
import { useUserEdits } from "./UserEditsProvider";
import { socket } from '@/utils/sockets';
import { getComponentyByName } from "@/utils/enums";

interface Specifications {
    id: number;
    name: string;
    description: string;
    isEditing?: boolean;
    color: string;
    isFavorite?: boolean;
    isColorPickerOpen: boolean;
}

const SpecificationsList: React.FC = () => {
    const { projectID } = useParams();
    const [specifications, setSpecifications] = useState<Specifications[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
    const [isBeingEdited, setIsBeingEdited] = useState<boolean>(true);
    const [isRegenerateChatOpen, setIsRegenerateChatOpen] = useState<boolean>(false);
    const [isUpdateChatOpen, setIsUpdateChatOpen] = useState<boolean>(false);
    const [newCard, setNewCard] = useState(false);
    const [newCardContent, setNewCardContent] = useState({ name: "", description: "", color: "", icon: "", isColorPickerOpen: false });
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectionBox, setSelectionBox] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [containerOffsetLeft, setContainerOffsetLeft] = useState<number>(0);

    const { componentUserMap, addUserToComponent, removeUserFromComponent } = useUserEdits();

    const colorOptions = [
        { color: "bg-red-300", label: "Red" },
        { color: "bg-blue-300", label: "Blue" },
        { color: "bg-green-300", label: "Green" },
        { color: "bg-yellow-300", label: "Yellow" },
        { color: "bg-purple-300", label: "Purple" },
        { color: "bg-white-300", label: "White" },
    ];

    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

    const textareaRefs = useRef<{ [key: number]: HTMLTextAreaElement | null }>({});

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`${API_URLS.API_SERVER_URL}/model/specifications/${projectID}`);
            setSpecifications(
                response.data.specifications.map((spec: Specifications, index) => ({
                    ...spec,
                    id: index,
                    isEditing: false,
                    color: 'bg-white',
                    isFavorite: false,
                    isColorPickerOpen: false
                }))
            );
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [projectID]);

    const handleEdit = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setSpecifications((prevSpecifications) =>
            prevSpecifications.map((spec) =>
                spec.id === id ? { ...spec, isEditing: true } : { ...spec, isEditing: false }
            )
        );
    };

    const handleSave = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const specToSave = specifications.find((spec) => spec.id === id);
        if (!specToSave) return;

        try {
            // await axiosInstance.put(`${API_URLS.API_SERVER_URL}/model/specifications/${id}`, specToSave);
            setSpecifications((prevSpecifications) =>
                prevSpecifications.map((spec) =>
                    spec.id === id ? { ...spec, isEditing: false } : spec
                )
            );
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    const handleCancel = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setSpecifications((prevSpecifications) =>
            prevSpecifications.map((spec) =>
                spec.id === id ? { ...spec, isEditing: false } : spec
            )
        );
    };

    const handleAddNewCard = async () => {
        if (newCard) {
            const tempId = specifications.length ? specifications[specifications.length - 1].id + 1 : 1;
            const newSpecification = { id: tempId, ...newCardContent };
            setSpecifications([...specifications, newSpecification]);
            setNewCard(false);
            setNewCardContent({ name: "", description: "", color: "", icon: "", isColorPickerOpen: false });

            try {
                // await axiosInstance.post(`${API_URLS.API_SERVER_URL}/model/specifications`, newCardContent);
            } catch (error) {
                console.error("Error adding new card:", error);
            }
        } else {
            setNewCard(true);
        }
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            // await axiosInstance.delete(`${API_URLS.API_SERVER_URL}/model/specifications/${id}`);
            setSpecifications((prevSpecifications) =>
                prevSpecifications.filter((spec) => spec.id !== id)
            );
        } catch (error) {
            console.error("Error deleting specification:", error);
        }
    };

    const toggleFavorite = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setSpecifications((prevSpecifications) =>
            prevSpecifications.map((spec) =>
                spec.id === id ? { ...spec, isFavorite: !spec.isFavorite } : spec
            )
        );
    };



    const toggleColorPicker = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setSpecifications((prevSpecifications) =>
            prevSpecifications.map((spec) =>
                spec.id === id
                    ? { ...spec, isColorPickerOpen: !spec.isColorPickerOpen }
                    : { ...spec, isColorPickerOpen: false }
            )
        );
    };


    const selectColor = (color: string, specificationId: number) => {
        setSpecifications((prevSpecifications) =>
            prevSpecifications.map((spec) =>
                spec.id === specificationId
                    ? { ...spec, color, isColorPickerOpen: false }
                    : spec
            )
        );
    };


    const autoResize = (e: React.FormEvent<HTMLTextAreaElement>, id: number) => {
        const textarea = textareaRefs.current[id];
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };



    const handleSelectionStart = (event: React.MouseEvent) => {
        if (event.button !== 0) return;
        if (!event.ctrlKey) setSelectedItems([]);
        // if (toolbarRef.current && toolbarRef.current.contains(event.target as Node)) {
        //     return;
        // }

        setSelectionBox({
            startX: event.clientX,
            startY: event.clientY,
            endX: event.clientX,
            endY: event.clientY,
        });
    };

    const handleSelectionEnd = () => {
        if (selectionBox) {
            const selectedIds = specifications.filter((spec, index) => {
                const element = containerRef.current?.children[index] as HTMLElement;
                if (!element) return false;
                // if (specifications[spec.id].isEditing) return false;

                const rect = element.getBoundingClientRect();

                return (
                    rect.left < Math.max(selectionBox.startX - containerOffsetLeft - 1, selectionBox.endX - containerOffsetLeft - 1) &&
                    rect.right > Math.min(selectionBox.startX, selectionBox.endX) &&
                    rect.top < Math.max(selectionBox.startY, selectionBox.endY) &&
                    rect.bottom > Math.min(selectionBox.startY, selectionBox.endY)
                );

            }).map((spec) => spec.id);

            setSelectedItems((prevSelected) => [...new Set([...prevSelected, ...selectedIds])]);
            setSelectionBox(null);
        }
    };
    const handleCtrlClickSelect = (specId: number, event: React.MouseEvent) => {

        if (event.button !== 0 || specifications[specId].isEditing) return;

        setSelectedItems((prevSelected) => {

            return [...prevSelected, specId];
        });
    };

    useEffect(() => {
        if (containerRef.current) {
            setContainerOffsetLeft(containerRef.current.getBoundingClientRect().left);
        }

        const handleResize = () => {
            if (containerRef.current) {
                setContainerOffsetLeft(containerRef.current.getBoundingClientRect().left);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [containerRef.current?.getBoundingClientRect().left]);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (selectionBox) {
                setSelectionBox(prev => prev && {
                    ...prev,
                    endX: event.clientX,
                    endY: event.clientY
                });
            }
        };

        const handleMouseUp = () => {
            handleSelectionEnd();
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [selectionBox, specifications]);



    // ---------------------------------------------------------------------

    const handleEditSaveButtonClick = () => {
        setIsEditingMode(false);
        setIsRegenerateChatOpen(false);
        setIsUpdateChatOpen(false);
    };

    const addUserEditing = (setUsersEditing, newUser) => {
        setUsersEditing(prevUsers => {
            if (!prevUsers.find(user => user.nick === newUser.nick)) {
                const updatedUsers = [...prevUsers, newUser];
                return updatedUsers;
            }
            return prevUsers;
        });
    };

    const UserAvatars = ({ usersEditing, currentUser }) => {
        const sortedUsers = [...usersEditing.filter(u => u.name !== currentUser.name), currentUser];

        return (
            <TooltipProvider>
                <div className="relative flex items-center justify-center space-x-2 group" style={{ width: "50%" }}>
                    <div className="flex -space-x-3">
                        {sortedUsers.map((user, index) => (
                            <img
                                key={index}
                                src={user.avatarUrl}
                                alt={user.name}
                                className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                                style={{ transform: `translateX(-${index * 6}px)` }}
                            />
                        ))}
                    </div>
                    <Tooltip>
                        <TooltipTrigger className="flex">
                            <div className="absolute inset-0" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="flex flex-col">
                                {sortedUsers.map((user, index) => (
                                    <span key={index} className="text-sm text-gray-700">
                                        {user.name}
                                    </span>
                                ))}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        );
    };
    const positionRef = useRef({ x: 0, y: 0 });

    const toolbarRef = useRef(null);
    const isDragging = useRef(false);

    const FloatingToolbar = React.memo(() => {
        const handleEditButtonClick = () => {
            const message = { component: getComponentyByName("specifications").id }
            socket.emit("edit-component", message);
            setIsEditingMode(true); //not here


        };

        const { user } = useUser();

        const [usersEditing, setUsersEditing] = useState([
            {
                avatarUrl: "https://cat-avatars.vercel.app/api/cat?name=User1",
                name: "User1"
            },
            {
                avatarUrl: "https://cat-avatars.vercel.app/api/cat?name=User2",
                name: "User2"
            }
        ]);



        const handleAddUser = () => {
            const newUser = {
                avatarUrl: "https://example.com/avatar.jpg",
                name: "NowyUser"
            };
            addUserEditing(setUsersEditing, newUser);
        };



        const handleMouseDown = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (toolbarRef.current && toolbarRef.current.contains(e.target)) {

                isDragging.current = true;
                toolbarRef.current.startX = e.clientX - positionRef.current.x;
                toolbarRef.current.startY = e.clientY - positionRef.current.y;

                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
            }
        };


        const handleMouseMove = (e) => {
            if (isDragging.current && toolbarRef.current && toolbarRef.current.parentElement) {
                const toolbarWidth = toolbarRef.current.offsetWidth;
                const toolbarHeight = toolbarRef.current.offsetHeight;
                const parentWidth = toolbarRef.current.parentElement.offsetWidth;
                const parentHeight = toolbarRef.current.parentElement.offsetHeight;

                let newX = e.clientX - toolbarRef.current.startX;
                let newY = e.clientY - toolbarRef.current.startY;

                newX = Math.max(-(parentWidth - toolbarWidth - 20), Math.min(newX, toolbarWidth));
                newY = Math.max(-(parentHeight - toolbarHeight - 30), Math.min(newY, toolbarHeight));

                positionRef.current = { x: newX, y: newY };
                toolbarRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
            }
        };




        const handleMouseUp = () => {
            isDragging.current = false;
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        return (
            // <div style={{ background: "red", width: "100%", position: "absolute", height: "100vh", zIndex: "100" }} onClick={(e) => {
            // e.stopPropagation();

            // }}>

            <div
                className="toolbar-container flex items-center space-x-4"
                style={{
                    position: "absolute",
                    transform: `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`,
                    height: "fit-content"
                }}
                ref={toolbarRef}
                onMouseDown={handleMouseDown}
                onClick={(e) => {
                    e.stopPropagation();
                }}>
                {isBeingEdited ? (
                    <UserAvatars usersEditing={usersEditing} currentUser={{ name: "You", avatarUrl: user.avatarurl }} />
                ) : null}
                {isBeingEdited ? <Separator orientation="vertical" className="h-5" /> : null}

                {isEditingMode ? (
                    <div className="toolbar">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <LuPocketKnife onClick={() => {
                                        setIsUpdateChatOpen((prev) => !prev)
                                    }} size={25} />
                                </TooltipTrigger>
                                <TooltipContent>Update with AI</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger>
                                    <MdOutlineSwitchAccessShortcutAdd onClick={() => {
                                        setIsRegenerateChatOpen((prev) => !prev)
                                    }} size={25} />
                                </TooltipTrigger>
                                <TooltipContent>Regenerate with AI</TooltipContent>
                            </Tooltip>


                            <Tooltip>
                                <TooltipTrigger>
                                    <FiSave onClick={() => handleEditSaveButtonClick()} size={25} />
                                </TooltipTrigger>
                                <TooltipContent>Save</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                ) : (
                    <div className="edit-button" onClick={() => handleEditButtonClick()}>
                        <FaEdit size={25} />
                    </div>
                )}
            </div>)
        // </div>

    });


    const positionRefChat = useRef({ x: 0, y: 0 });
    const positionRefInfo = useRef({ x: 0, y: 0 });
    const isDraggingChat = useRef(false);
    const isDraggingInfo = useRef(false);

    const ChatButton = React.memo(() => {
        const chatRef = useRef(null);

        const handleMouseDown = (e) => {
            if (chatRef.current && chatRef.current.contains(e.target)) {
                isDraggingChat.current = true;
                chatRef.current.startX = e.clientX - positionRefChat.current.x;
                chatRef.current.startY = e.clientY - positionRefChat.current.y;
                document.addEventListener("mousemove", handleMouseMoveChat);
                document.addEventListener("mouseup", handleMouseUpChat);
            }
        };

        const handleMouseMoveChat = (e) => {
            if (isDraggingChat.current && chatRef.current && chatRef.current.parentElement) {
                const chatWidth = chatRef.current.offsetWidth;
                const chatHeight = chatRef.current.offsetHeight;
                const parentWidth = chatRef.current.parentElement.offsetWidth;
                const parentHeight = chatRef.current.parentElement.offsetHeight;

                let newX = e.clientX - chatRef.current.startX;
                let newY = e.clientY - chatRef.current.startY;

                newX = Math.max(-(parentWidth - chatWidth - 20), Math.min(newX, chatWidth));
                newY = Math.max(-(parentHeight - chatHeight - 30), Math.min(newY, chatHeight));

                positionRefChat.current = { x: newX, y: newY };
                chatRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
            }
        };

        const handleMouseUpChat = () => {
            isDraggingChat.current = false;
            document.removeEventListener("mousemove", handleMouseMoveChat);
            document.removeEventListener("mouseup", handleMouseUpChat);
        };

        if (!isUpdateChatOpen) {
            return (<></>)
        }

        return (
            <div
                className="absolute right-5 bottom-20 z-50 flex flex-row bg-white rounded-md shadow-lg"
                style={{
                    transform: `translate(${positionRefChat.current.x}px, ${positionRefChat.current.y}px)`,
                }}
                ref={chatRef}
                onMouseDown={handleMouseDown}
            >
                <div className="flex flex-col justify-between p-1.5 bg-gray-200">
                    <div className="h-[30%] hover:text-red-500 cursor-pointer">
                        <IoCloseSharp onClick={() => {
                            setIsUpdateChatOpen(false)
                        }} size={20} />
                    </div>
                    <div className="flex items-center justify-center h-[60%] bg-black text-white rounded-md">
                        <PiPaperPlaneRightFill size={15} />
                    </div>
                </div>
                <Textarea
                    placeholder={
                        selectedItems.length > 0
                            ? "Write what you want to update. Applicable to elements: " +
                            Array.from(new Set(selectedItems))
                                .map(num => num + 1)
                                .sort((a, b) => a - b)
                                .join(", ")
                            : "Write what you want to update."
                    }
                />
            </div>
        );
    });

    const InfoButton = React.memo(() => {
        const infoRef = useRef(null);

        const handleMouseDown = (e) => {
            if (infoRef.current && infoRef.current.contains(e.target)) {
                isDraggingInfo.current = true;
                infoRef.current.startX = e.clientX - positionRefInfo.current.x;
                infoRef.current.startY = e.clientY - positionRefInfo.current.y;
                document.addEventListener("mousemove", handleMouseMoveInfo);
                document.addEventListener("mouseup", handleMouseUpInfo);
            }
        };

        const handleMouseMoveInfo = (e) => {
            if (isDraggingInfo.current && infoRef.current && infoRef.current.parentElement) {
                const regenWidth = infoRef.current.offsetWidth;
                const regenHeight = infoRef.current.offsetHeight;
                const parentWidth = infoRef.current.parentElement.offsetWidth;
                const parentHeight = infoRef.current.parentElement.offsetHeight;

                let newX = e.clientX - infoRef.current.startX;
                let newY = e.clientY - infoRef.current.startY;

                newX = Math.max(-(parentWidth - regenWidth - 20), Math.min(newX, regenWidth));
                newY = Math.max(-(parentHeight - regenHeight - 176), Math.min(newY, 2 * regenHeight));

                positionRefInfo.current = { x: newX, y: newY };
                infoRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
            }
        };

        const handleMouseUpInfo = () => {
            isDraggingInfo.current = false;
            document.removeEventListener("mousemove", handleMouseMoveInfo);
            document.removeEventListener("mouseup", handleMouseUpInfo);
        };

        if (!isRegenerateChatOpen) {
            return (<></>)
        }

        return (
            <div
                className="absolute right-5 bottom-44 z-50 flex flex-row bg-white rounded-md shadow-lg"
                style={{
                    position: "absolute",
                    transform: `translate(${positionRefInfo.current.x}px, ${positionRefInfo.current.y}px)`,
                }}
                ref={infoRef}
                onMouseDown={handleMouseDown}
            >

                <div className="flex flex-col justify-between p-1.5 bg-gray-200">
                    <div className="h-[30%] hover:text-red-500 cursor-pointer">
                        <IoCloseSharp onClick={() => {
                            setIsRegenerateChatOpen(false)
                        }} size={20} />
                    </div>
                    <div className="flex items-center justify-center h-[60%] bg-black text-white rounded-md">
                        <PiPaperPlaneRightFill size={15} />
                    </div>
                </div>
                <Textarea
                    placeholder={
                        selectedItems.length > 0
                            ? "Write what to regenerate. Applicable to elements: " +
                            Array.from(new Set(selectedItems))
                                .map(num => num + 1)
                                .sort((a, b) => a - b)
                                .join(", ")
                            : "Write what to regenerate."
                    }
                />
            </div>
        );
    });


    if (isLoading) {
        return (
            <div className="flex flex-wrap justify-center items-start gap-4 p-4 relative">
                {Array.from({ length: 7 }).map((_, index) => (
                    <Skeleton key={index} className="h-32 w-full m-2 max-w-lg" />
                ))}
            </div>

        )
    }

    return (
        <div className="h-screen">
            <ChatButton />
            <InfoButton />
            <FloatingToolbar />
            <div
                onMouseDown={handleSelectionStart}
                className="relative h-screen"
            >

                <header className="text-center py-4 bg-gray-200">
                    <h1 className="text-2xl font-bold">Project Specifications</h1>
                    <p className="text-gray-600">Manage and customize the specifications of your project</p>
                </header>

                <div ref={containerRef} className="flex flex-wrap justify-center items-start gap-4 p-4 relative">
                    {specifications.map((specification, index) => (
                        <div
                            key={specification.id}
                            onClick={(e) => !specification.isEditing ? handleCtrlClickSelect(specification.id, e) : setSelectedItems([])}

                            className={`max-w-lg w-full px-4 pt-4 border rounded-lg shadow-md ${(selectedItems.includes(specification.id) && !specification.isEditing) ? "bg-blue-100" : specification.color}  ${specification.isFavorite ? "shadow-xl border-2 border-green-500" : ""}  relative`}
                        >
                            <div className="flex justify-beetwen items-center mb-2" onClick={(e) => {
                                e.stopPropagation();
                            }}>
                                <span className="text-gray-800 text-sm absolute top-1 left-2 flex items-center justify-center">
                                    <p className="font-semibold w-5 h-5 flex justify-center items-center rounded-br-md mr-1">{index + 1}</p>
                                    <div className="flex items-center justify-center" style={{ paddingTop: "2px" }} onClick={(e) => {
                                        toggleFavorite(specification.id, e);
                                    }} >
                                        {isEditingMode ? (

                                            specification.isFavorite ? (
                                                <FaHeart
                                                    className="w-5 h-5 text-red-500 cursor-pointer" />
                                            ) : (
                                                <FaRegHeart className="w-5 h-5 text-gray-400 cursor-pointer" />
                                            )
                                        ) : <></>}
                                    </div>
                                </span>
                                {specification.isEditing && isEditingMode ? (
                                    <div className="flex gap-2 w-full flex items-center justify-end" onClick={(e) => { e.stopPropagation(); }}>
                                        <div className="relative flex items-center justify-center"
                                            onClick={(e) => { e.stopPropagation(); }}
                                        >
                                            <button
                                                type="button"
                                                className={`w-7 h-7 ${specification.color} text-gray-500`}
                                                onClick={(e) => { e.stopPropagation(); toggleColorPicker(specification.id, e); }}

                                            >
                                                <TfiPaintBucket />
                                            </button>
                                            {specification.isColorPickerOpen && (
                                                <div className="absolute mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                    <div className="grid grid-cols-3 gap-2 p-2">
                                                        {colorOptions.map(({ color, label }) => (
                                                            <div
                                                                key={label}
                                                                className={`w-5 h-5 shadow-[0_0_5px_1px_rgb(228,228,228)] rounded-sm border border-gray-200 cursor-pointer ${color}`}
                                                                onClick={(e) => { e.stopPropagation(); selectColor(color, specification.id); }}
                                                                title={label}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <FaCheck className="w-5 h-5 text-green-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleSave(specification.id, e); }} />
                                        <IoCloseSharp className="w-5 h-5 text-red-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleCancel(specification.id, e); }} />

                                    </div>
                                ) : (
                                    <div className="flex gap-2 w-full flex items-center justify-end">
                                        {isEditingMode ? (
                                            <MdEdit
                                                className="w-5 h-5 text-gray-400 cursor-pointer"
                                                onClick={(e) => { handleEdit(specification.id, e); }}
                                            />) : <></>}
                                        {isEditingMode ? (
                                            <FaTrash
                                                className="w-4 h-4 text-red-500 cursor-pointer"
                                                onClick={(e) => { handleDelete(specification.id, e); }}
                                            />) : <></>}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4" onClick={(e) => {
                                e.stopPropagation();
                            }}>
                                {specification.isEditing ? (
                                    <>
                                        <textarea
                                            ref={(el) => (textareaRefs.current[specification.id] = el)}
                                            className="w-full mt-2 rounded-md p-2 bg-transparent resize-none shrink-0"
                                            value={specification.description}

                                            rows={4}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setSpecifications((prevSpecifications) =>
                                                    prevSpecifications.map((spec) =>
                                                        spec.id === specification.id
                                                            ? { ...spec, description: value }
                                                            : spec
                                                    )
                                                );
                                            }}
                                            onClick={(e) => { e.stopPropagation(); }}
                                            onInput={(e) => autoResize(e, specification.id)}
                                            onBlur={() => handleSave(specification.id)}
                                        />
                                    </>
                                ) : (
                                    <p className="mt-4 text-base text-gray-700 flex items-center gap-2">
                                        {specification.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                    }

                    {newCard ? (
                        <div className={`max-w-lg w-full p-4 border rounded-lg border-dashed border-gray-300 shadow-md relative ${newCardContent.color}`}>
                            <div className="flex gap-2 w-full flex items-center justify-end">
                                <div className="relative flex items-center justify-center">
                                    <button
                                        type="button"
                                        className={`w-7 h-7 ${newCardContent.color} text-gray-500`}
                                        onClick={(e) => { e.stopPropagation(); setIsColorPickerOpen(!isColorPickerOpen); }}

                                    >
                                        <TfiPaintBucket />
                                    </button>
                                    {isColorPickerOpen && (
                                        <div className="absolute mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                            <div className="grid grid-cols-3 gap-2 p-2">
                                                {colorOptions.map(({ color, label }) => (
                                                    <div
                                                        key={label}
                                                        className={`w-5 h-5 border rounded-full cursor-pointer ${color}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setNewCardContent({ ...newCardContent, color });
                                                            setIsColorPickerOpen(false);
                                                        }}
                                                        title={label}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <FaCheck
                                    className="w-5 h-5 text-green-500 cursor-pointer"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleAddNewCard();
                                    }}
                                />

                                <IoCloseSharp
                                    className="w-5 h-5 text-red-500 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setNewCard(false);
                                        setNewCardContent({
                                            name: "",
                                            description: "",
                                            color: "",
                                            icon: "",
                                            isColorPickerOpen: false
                                        });
                                    }}
                                />

                            </div>
                            <textarea
                                ref={(el) => (textareaRefs.current[-1] = el)}
                                className="w-full mt-2 rounded-md p-2 bg-transparent resize-none shrink-0"
                                placeholder="New Specification Description"
                                value={newCardContent.description}
                                onInput={(e) => autoResize(e, -1)}
                                onBlur={(e) => setNewCardContent({ ...newCardContent, description: e.target.value })}
                                onChange={(e) => setNewCardContent({ ...newCardContent, description: e.target.value })}
                            />
                        </div>
                    ) : (
                        isEditingMode ? (
                            <div
                                className="max-w-lg w-full p-4 border-dashed border-2 border-gray-300 flex items-center justify-center cursor-pointer rounded-lg"
                                onClick={(e) => { e.stopPropagation(); setNewCard(true); }}
                            >
                                <CiCirclePlus className="w-8 h-8 text-gray-400" />
                            </div>
                        ) : (
                            <></>
                        )
                    )}
                </div>
                {selectionBox && (
                    <div
                        className="absolute bg-blue-200 opacity-50 border border-blue-500"
                        style={{
                            left: Math.min(selectionBox.startX, selectionBox.endX) - containerOffsetLeft - 1,
                            top: Math.min(selectionBox.startY, selectionBox.endY),
                            width: Math.abs(selectionBox.endX - selectionBox.startX),
                            height: Math.abs(selectionBox.endY - selectionBox.startY),
                        }}
                    ></div>
                )}
            </div>
        </div>

    );
};

export default SpecificationsList;