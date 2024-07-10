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

const ProjectView = ({ }) => {


    const { projectID } = useParams();
    const [isCollapsedLeft, setIsCollapsedLeft] = useState(true);
    const [isCollapsedRight, setIsCollapsedRight] = useState(true);

    const toggleCollapseLeft = () => {
        setIsCollapsedLeft(!isCollapsedLeft);
    };

    const toggleCollapseRight = () => {
        setIsCollapsedRight(!isCollapsedRight);
    };


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
                        userId="6671f67b1964c25bba263ec1" 
                        userNick="6671f67b1964c25bba263ec1"
                        authToken={1} 
                    />
                </ResizablePanel>
            </ResizablePanelGroup>

        </div>


    );
};

export default ProjectView;