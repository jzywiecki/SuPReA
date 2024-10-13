import ProjectElementsList from '@/components/ProjectElementsList';
import Chat from '../components/Chat';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import { useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import RegenerateProjectButton from '@/components/RegenerateProjectButton';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import InviteModal from '@/components/InviteModal';
import Search from '@/components/Search';
import axios from 'axios';
import { User } from '@/pages/SearchAndAddFriends';
import { useUser } from '@/components/UserProvider';

const ProjectView = ({ }) => {
    const { user } = useUser();
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const openInviteModal = () => {
        setIsInviteModalOpen(true);
    };

    const closeInviteModal = () => {
        setIsInviteModalOpen(false);
    };

    const { projectID } = useParams();
    const [isCollapsedLeft, setIsCollapsedLeft] = useState(true);
    const [isCollapsedRight, setIsCollapsedRight] = useState(true);

    const toggleCollapseLeft = () => {
        setIsCollapsedLeft(!isCollapsedLeft);
    };

    const toggleCollapseRight = () => {
        setIsCollapsedRight(!isCollapsedRight);
    };

    const handleSearch = async (searchQuery: string) => {
        try {
            const response = await axios.get<User[]>(`http://localhost:3333/users/filter?user_id=${user?.id}&filter=${searchQuery}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const handleAddMember = async (friendId: string) => {
        try {
            const url = `http://localhost:8000/projects/${projectID}/members/add`;

            await axios.post(url);
            closeInviteModal();
        } catch (error) {
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
                                    <Button variant="secondary" onClick={openInviteModal} className="">
                Invite Members
            </Button>
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
                    minSize={!isCollapsedRight ? 5 : 15}
                    defaultSize={!isCollapsedRight ? 5 : 15}
                >
                    <div className={`flex h-10 m-4 ${isCollapsedRight ? 'justify-start' : 'justify-center'}`}>
                        <Button variant="outline" size="icon" onClick={toggleCollapseRight}>
                            <MenuIcon className="h-[1.2rem] w-[1.2rem]" />
                        </Button>

                    </div>
                    <RegenerateProjectButton />
                    <Chat 
                        isCollapsed={isCollapsedRight} 
                        projectId={ projectID } 
                        userId={ user.id }
                        userNick={ user.username }
                        authToken="1"
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