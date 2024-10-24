import ProjectElementsList from '@/components/ProjectElementsList';
import Chat from '../components/Chat';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import { useState, useEffect } from "react";
import { Outlet, useParams } from 'react-router-dom';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import ConnectionStatus from '@/components/ui/connection-status';
import InviteModal from '@/components/InviteModal';
import Search from '@/components/Search';
import { User } from '@/pages/SearchAndAddFriends';
import { useUser } from '@/components/UserProvider';
import { API_URLS } from '@/services/apiUrls';
import axiosInstance from '@/services/api';
import { socket } from '@/utils/sockets';
import { getComponentById } from '@/utils/enums';
import { GenerationResponse } from '@/utils/generation';

import { useSnackbar } from 'notistack';

const ProjectView = ({ }) => {
    const { user } = useUser();
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const { projectID } = useParams();
    const [isCollapsedLeft, setIsCollapsedLeft] = useState(true);
    const [isCollapsedRight, setIsCollapsedRight] = useState(true);

    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        socket.auth = {
            projectId: projectID,
            userId: user.id,
            discussionChatOffset: 0,
            aiChatOffset: 0
        };

        socket.connect();

        function onConnect(): void {
            setConnected(true);
        }


        function onDisconnect(): void {
            setConnected(false);
        }


        function onConnectionError(err: Error): void {
            setConnected(false);
            console.log("[CONNECTION ERROR] " + err);
        }


        function onError(err: string): void {
            console.log("[ERROR] " + err);
            //TODO: here should be error pop-up.
        }


        function onGenerationComplete(response: GenerationResponse): void {
            const component = getComponentById(response.component);
            console.log("Generated: ")
            console.log(component)
            // For Krzysiek.
            // After components generation (after creating a project), we receive notifications here.
            // You receive a notification in the format (GenerationResponse):
            // {
            //     component: "<specific id>",
            //     code: 1
            // }
            // where "component" is the ID of the component, and "code" is a constant indicating the notification type.
        }


        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('connect_error', onConnectionError);
        socket.on('notify-generation-complete', onGenerationComplete)
        socket.on('error', onError);


        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('connect_error', onConnectionError);
            socket.off('notify-generation-complete', onGenerationComplete);
            socket.disconnect();
        };
    }, []);

    const { enqueueSnackbar } = useSnackbar();

    const openInviteModal = () => {
        setIsInviteModalOpen(true);
    };

    const closeInviteModal = () => {
        setIsInviteModalOpen(false);
    };

    const toggleCollapseLeft = () => {
        setIsCollapsedLeft(!isCollapsedLeft);
    };

    const toggleCollapseRight = () => {
        setIsCollapsedRight(!isCollapsedRight);
    };

    const handleSearch = async (searchQuery: string) => {
        try {
            const response = await axiosInstance.get<User[]>(`${API_URLS.BASE_URL}/users/filter?user_id=${user?.id}&filter=${searchQuery}`);
            setSearchResults(response.data);
        } catch (error) {
            enqueueSnackbar(`Error searching users: ${error.response?.status ?? 'Unknown error'}`, { variant: 'error' });
            console.error('Error searching users:', error);
        }
    };

    const handleAddMember = async (friendId: string) => {
        try {
            const url = `${API_URLS.API_SERVER_URL}/projects/${projectID}/members/add`;

            await axiosInstance.post(url);
            closeInviteModal();
        } catch (error) {
            enqueueSnackbar(`Error adding member: ${error.response?.status ?? 'Unknown error'}`, { variant: 'error' });
            console.error('Error adding member:', error);
        }
    }


    const elements = [
        { id: 1, name: "Name", description: "Name for your project" },
        { id: 3, name: "Specifications", description: "Specifications of the project" },
        { id: 4, name: "Requirements", description: "Functional and non-functional requirements" },
        { id: 5, name: "Actors", description: "Defining actors of the project" },
        { id: 6, name: "Risk", description: "Risk management for your project" },
        { id: 9, name: "Motto", description: "Motto for your project" },
        { id: 10, name: "Strategy", description: "Strategy for your project" },
        { id: 11, name: "Elevator speech", description: "Content for pitching idea" },
        { id: 12, name: "Business scenario", description: "Business scenario for your project" },
        { id: 13, name: "UML", description: "UML diagrams" },
        { id: 14, name: "Schedule", description: "Estimate project schedule" },
        { id: 15, name: "Database diagram", description: "Draw initial database diagram" },
    ]

    return (
        <div style={{ height: 'calc(100vh - 64px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '16px' }}>
                <ConnectionStatus connected={connected} />
                <Button variant="secondary" onClick={openInviteModal}>
                    Invite Members
                </Button>
            </div>

            <ResizablePanelGroup
                direction="horizontal"
                className="w-full border"
            >
                <ResizablePanel
                    maxSize={!isCollapsedLeft ? 5 : 30}
                    minSize={!isCollapsedLeft ? 5 : 15}
                    defaultSize={!isCollapsedLeft ? 5 : 15}
                >
                    <div className={`flex h-10 m-4 ${isCollapsedLeft ? 'justify-end' : 'justify-center'}`}>
                        <Button variant="outline" size="icon" onClick={toggleCollapseLeft}>
                            <MenuIcon className="h-[1.2rem] w-[1.2rem]" />
                        </Button>
                    </div>

                    <ProjectElementsList elements={elements} isCollapsed={isCollapsedLeft} />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={50} style={{ position: 'relative' }}>

                    <Outlet />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel
                    maxSize={!isCollapsedRight ? 5 : 30}
                    minSize={!isCollapsedRight ? 5 : 18}
                    defaultSize={!isCollapsedRight ? 5 : 20}
                >
                    <div className={`flex h-10 m-4 ${isCollapsedRight ? 'justify-start' : 'justify-center'}`}>
                        <Button variant="outline" size="icon" onClick={toggleCollapseRight}>
                            <MenuIcon className="h-[1.2rem] w-[1.2rem]" />
                        </Button>

                    </div>
                    <Chat
                        isCollapsed={isCollapsedRight}
                    />
                </ResizablePanel>
            </ResizablePanelGroup>


            <InviteModal isOpen={isInviteModalOpen} onClose={closeInviteModal}>
                <Search
                    onSearch={handleSearch}
                    searchResults={searchResults}
                    friends={[]}
                    onClick={handleAddMember}
                    userId={user.id}
                    actionType='addMember'
                />
            </InviteModal>
        </div>


    );
};

export default ProjectView;