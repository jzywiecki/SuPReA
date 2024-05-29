import ProjectElementsList from '@/components/ProjectElementsList';
import Chat from '../components/Chat';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import { useState } from 'react';
import TextStructure from '../components/TextStructure';

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
  

const ProjectView = ({ projectName }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const elements = [
        {id: 1, name: "Name", description: "Name for your project"},
        {id: 2, name: "UML diagrams", description: "UML diagrams useful to show the structure of the system"},
        {id: 3, name: "Specifications", description: "Specifications of the project"},
        {id: 4, name: "Requirements", description: "Functional and non-functional requirements"},
        {id: 5, name: "Actors and Risks", description: "Defining actors and risks of the project"},
        {id: 6, name: "Data model", description: "Data model of suggested database"},
        {id: 7, name: "Classes", description: "Classes assumming object-oriented programming"},
        {id: 8, name: "Logo", description: "Logo for your project"},
    ]

  return (
    <div>
        <ResizablePanelGroup
        direction="horizontal"
        className="w-full border"
        >
            <ResizablePanel
                    maxSize={!isCollapsed ? 5 : 30}
                    minSize={!isCollapsed ? 5 : 15}
                    defaultSize={!isCollapsed ? 5 : 15}
                >
                <div className={`flex m-4 ${isCollapsed ? 'justify-end' : 'justify-center'}`}>
                    <Button variant="outline" size="icon" onClick={toggleCollapse}>
                        <MenuIcon className="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                </div>
                <ProjectElementsList elements={elements} isCollapsed={isCollapsed} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
                <div className="h-full flex align-middle justify-center">
                    <TextStructure />
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={20} maxSize={25}>
                <Chat />
            </ResizablePanel>
        </ResizablePanelGroup> 

    </div>


  );
};

export default ProjectView;