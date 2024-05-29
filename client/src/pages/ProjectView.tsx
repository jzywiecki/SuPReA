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
    const [isCollapsedLeft, setIsCollapsedLeft] = useState(true);
    const [isCollapsedRight, setIsCollapsedRight] = useState(true);

    const toggleCollapseLeft = () => {
        setIsCollapsedLeft(!isCollapsedLeft);
    };

    const toggleCollapseRight = () => {
        setIsCollapsedRight(!isCollapsedRight);
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
    <div style={{ height: 'calc(100vh - 64px)'}}>
        <ResizablePanelGroup
        direction="horizontal"
        className="w-full border"
        >
            <ResizablePanel
                    maxSize={!isCollapsedLeft ? 5 : 30}
                    minSize={!isCollapsedLeft ? 5 : 15}
                    defaultSize={!isCollapsedLeft ? 5 : 15}
                >
                <div className={`flex m-4 ${isCollapsedLeft ? 'justify-end' : 'justify-center'}`}>
                    <Button variant="outline" size="icon" onClick={toggleCollapseLeft}>
                        <MenuIcon className="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                </div>
                <ProjectElementsList elements={elements} isCollapsed={isCollapsedLeft} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
                <div className="">
                    {/* <TextStructure component="Name" description="Name of your project" content="as dj ajs jhsaj kahsd kjhad hjdkshfsdad" /> */}
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel
                    maxSize={!isCollapsedRight ? 5 : 30}
                    minSize={!isCollapsedRight ? 5 : 15}
                    defaultSize={!isCollapsedRight ? 5 : 15}
                >
                <div className={`flex m-4 ${isCollapsedRight ? 'justify-start' : 'justify-center'}`}>
                    <Button variant="outline" size="icon" onClick={toggleCollapseRight}>
                        <MenuIcon className="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                </div>


                <Chat isCollapsed={isCollapsedRight}/>
            </ResizablePanel>
        </ResizablePanelGroup> 

    </div>


  );
};

export default ProjectView;