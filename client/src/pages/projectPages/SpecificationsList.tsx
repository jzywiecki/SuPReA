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
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { PiPaperPlaneRightFill } from "react-icons/pi";
import { socket } from '@/utils/sockets';
import { getComponentyByName } from "@/utils/enums";
import LoadingIndicator from "@/components/ui/loadingIndicator";
import FloatingToolbar from "../projectsUtils/FloatingToolbar";
import ChatButton from "../projectsUtils/ChatButton";


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
    const [regeneratedSpecifications, setRegeneratedSpecifications] = useState<Specifications[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

    const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
    const [isRegenerateChatOpen, setIsRegenerateChatOpen] = useState<boolean>(false);
    const [isUpdateChatOpen, setIsUpdateChatOpen] = useState<boolean>(false);
    const [newCard, setNewCard] = useState(false);
    const [newCardContent, setNewCardContent] = useState({ name: "", description: "", color: "", icon: "", isColorPickerOpen: false });
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectionBox, setSelectionBox] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [containerOffsetLeft, setContainerOffsetLeft] = useState<number>(0);

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
        return () => {
            const message = { component: getComponentyByName("specifications").id }
            socket.emit("finish-edition", message);
            setIsEditingMode(false);
            setIsRegenerateChatOpen(false);
            setIsUpdateChatOpen(false);
        }
    }, [projectID]);

    const removeTemporaryProperties = (specification) => { //TODO: modify backend too accept color, icon
        const { name, id, color, icon, isColorPickerOpen, isEditing, isFavorite, ...rest } = specification;
        return {
            ...rest,
            specification: name != undefined ? name : "",
        };
    };

    const handleEdit = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setSpecifications((prevSpecifications) =>
            prevSpecifications.map((spec) =>
                spec.id === id ? { ...spec, isEditing: true } : { ...spec, isEditing: false }
            )
        );
    };

    const handleSaveAllSpecifications = async () => {

        try {
            // await axiosInstance.put(`${API_URLS.API_SERVER_URL}/model/specifications/${id}`, specToSave);
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    const handleSave = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const specToSave = specifications.find((spec) => spec.id === id);
        if (!specToSave) return;

        setSpecifications((prevSpecifications) =>
            prevSpecifications.map((spec) =>
                spec.id === id ? { ...spec, isEditing: false } : spec
            )
        );

        handleSaveAllSpecifications();


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
        return () => {
            window.removeEventListener("resize", handleResize);

        }
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

    const [textareaValue, setTextareaValue] = useState("");


    const filterSpecifications = (specifications, selectedItems) => {
        let tmp_spec = specifications.filter(spec => selectedItems.includes(spec.id));
        tmp_spec = tmp_spec.map(removeTemporaryProperties);
        return tmp_spec;
    };

    const handleUpdateRequest = async () => {
        const filteredSpecifications = filterSpecifications(specifications, selectedItems);
        // const details = `${textareaValue} and regenerate me for following elements: + \n + ${JSON.stringify(filteredSpecifications)}`

        const component_val = { specifications: filteredSpecifications };

        const UpdateSpecificationsByAIRequest = {
            component_val: component_val,
            query: textareaValue,
            ai_model: "gpt-35-turbo",
        };

        try {
            setIsRegenerating(true);
            const response = await axiosInstance.post(`${API_URLS.API_SERVER_URL}/model/specifications/ai-update`, UpdateSpecificationsByAIRequest);
            setRegeneratedSpecifications(
                response.data.specifications.map((spec: Specifications, index) => ({
                    ...spec,
                    id: index,
                }))
            );
            console.log(response.data)
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setIsRegenerating(false);
        }
    };


    const positionRefInfo = useRef({ x: 0, y: 0 });

    const isDraggingInfo = useRef(false);


    const InfoButton = React.memo(() => {
        const infoRef = useRef(null);
        const [textareaValue, setTextareaValue] = useState("");


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

        const filterSpecifications = (specifications, selectedItems) => {
            let tmp_spec = specifications.filter(spec => selectedItems.includes(spec.id));
            tmp_spec = tmp_spec.map(removeTemporaryProperties);
            return tmp_spec;
        };

        const handleRegenerateRequest = async () => {
            const filteredSpecifications = filterSpecifications(specifications, selectedItems);
            const details = `${textareaValue} and regenerate me for following elements: + \n + ${JSON.stringify(filteredSpecifications)}`

            const regenerateComponentAIRequest = {
                details: details,
                ai_model: "gpt-35-turbo"
            };

            try {
                setIsRegenerating(true);
                const response = await axiosInstance.post(`${API_URLS.API_SERVER_URL}/model/specifications/ai-regenerate`, regenerateComponentAIRequest);
                setRegeneratedSpecifications(
                    response.data.specifications.map((spec: Specifications, index) => ({
                        ...spec,
                        id: index,
                    }))
                );
            } catch (error) {
                console.error('Error searching users:', error);
            } finally {
                setIsRegenerating(false);
            }
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
                onClick={(e) => { e.stopPropagation(); }}
            >

                <div className="flex flex-col justify-between p-1.5 bg-gray-200">
                    <div className="h-[30%] hover:text-red-500 cursor-pointer">
                        <IoCloseSharp onClick={() => {
                            setIsRegenerateChatOpen(false)
                        }} size={20} />
                    </div>
                    <div className="flex items-center justify-center h-[60%] bg-black text-white rounded-md">
                        <PiPaperPlaneRightFill onClick={() => handleRegenerateRequest()} size={15} />
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
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                />
            </div>
        );
    });


    const handleSpecificationsResponseSave = (id, event) => {
        event.stopPropagation();

        const newSpecification = regeneratedSpecifications.find(spec => spec.id === id);
        setRegeneratedSpecifications((prevSpecificationsNew) =>
            prevSpecificationsNew.filter(spec => spec.id !== id)
        );
        if (newSpecification) {
            const extendedSpecification = {
                ...newSpecification,
                isEditing: false,
                color: 'bg-white',
                isFavorite: false,
                isColorPickerOpen: false,
            };
            extendedSpecification.id = specifications.length

            setSpecifications((prevSpecifications) => [
                ...prevSpecifications,
                extendedSpecification,
            ]);
        }
        handleSaveAllSpecifications();
    };

    const handleSpecificationsResponseCancel = (id, event) => {
        setRegeneratedSpecifications((prevSpecificationsNew) =>
            prevSpecificationsNew.filter(spec => spec.id !== id)
        );
    };


    const LoadingIndicatorWrapper = (() => {
        return (
            <div className="newItemsLoader">
                <LoadingIndicator />
                <p>Updating</p>
            </div>
        )
    })

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
            <ChatButton setIsUpdateChatOpen={setIsUpdateChatOpen} isUpdateChatOpen={isUpdateChatOpen} handleUpdateRequest={handleUpdateRequest} setTextareaValue={setTextareaValue} textareaValue={textareaValue} selectedItems={selectedItems} />
            <InfoButton />
            <FloatingToolbar socket={socket} setIsEditingMode={setIsEditingMode} setIsRegenerateChatOpen={setIsRegenerateChatOpen} setIsUpdateChatOpen={setIsUpdateChatOpen} />

            {isRegenerating ? <LoadingIndicatorWrapper onClick={(e) => { e.stopPropagation(); }} /> : <></>}
            <div
                onMouseDown={handleSelectionStart}
                className="relative h-screen"
            >

                <header className="text-center py-4 bg-gray-200">
                    <h1 className="text-2xl font-bold">Project Specifications</h1>
                    <p className="text-gray-600">Manage and customize the specifications of your project</p>
                </header>



                <div ref={containerRef} className="flex flex-wrap justify-center items-start gap-4 p-4 relative">
                    {regeneratedSpecifications.length != 0 ?

                        (<>
                            {regeneratedSpecifications.map((specification, index) => (
                                <div
                                    key={specification.id + 1000}
                                    className={`tmp max-w-lg w-full px-4 pt-4  border rounded-lg  relative `}
                                >
                                    <div className="flex flex-row w-full justify-end mb-2" >
                                        <span className="text-green-600 text-sm absolute top-2 left-2 flex items-center justify-center">
                                            <p className="font-semibold w-5 h-5 flex justify-center items-center rounded-br-md mr-1">New</p>
                                        </span>
                                        <div className="flex absolute top-1 right-2 justify-end gap-2 mt-4">
                                            <FaCheck
                                                className="w-5 h-5 text-green-500 cursor-pointer"
                                                title="Save"
                                                onClick={(e) => {
                                                    handleSpecificationsResponseSave(specification.id, e)
                                                }}
                                            />
                                            <IoCloseSharp
                                                className="w-5 h-5 text-red-500 cursor-pointer"
                                                title="Cancel"
                                                onClick={(e) => handleSpecificationsResponseCancel(specification.id, e)}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4" >
                                        <p className="mt-4 text-base text-gray-700 flex items-center gap-2">
                                            {specification.description}
                                        </p>
                                    </div>

                                </div>
                            ))}
                        </>)
                        : <></>}

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
                                            isColorPickerOpen: false,
                                            isFavorite: false
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