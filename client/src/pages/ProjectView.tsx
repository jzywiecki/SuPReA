import ProjectElementsList from '@/components/ProjectElementsList';
import Chat from '../components/Chat';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import { useState } from 'react';
import NameList from './projectPages/NameList';
import UMLDiagrams from './projectPages/umlDiagrams';
import RequirementsList from './projectPages/RequirementsList';
import RiskList from './projectPages/RisksList';


import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import MottoList from './projectPages/MottoList';
import SpecificationsList from './projectPages/SpecificationsList';
import StrategyList from './projectPages/StrategyList';
import ActorList from './projectPages/ActorsList';
import ElevatorSpeech from './projectPages/ElevatorSpeech';
import BusinessScenario from './projectPages/BusinesScenario';


const ProjectView = ({ }) => {
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
        { id: 2, name: "UML diagrams", description: "UML diagrams useful to show the structure of the system" },
        { id: 3, name: "Specifications", description: "Specifications of the project" },
        { id: 4, name: "Requirements", description: "Functional and non-functional requirements" },
        { id: 5, name: "Actors and Risks", description: "Defining actors and risks of the project" },
        { id: 6, name: "Data model", description: "Data model of suggested database" },
        { id: 7, name: "Classes", description: "Classes assumming object-oriented programming" },
        { id: 8, name: "Logo", description: "Logo for your project" },
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
                    {/* <NameList/> */}
                    {/* <RequirementsList /> */}
                    {/* <RiskList /> */}
                    {/* <MottoList /> */}
                    {/* <SpecificationsList /> */}
                    {/* <StrategyList /> */}
                    {/* <ActorList /> */}
                    {/* <ElevatorSpeech /> */}
                    <BusinessScenario />

                    {/* <UMLDiagrams /> //TODO: */}


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
                    <Chat isCollapsed={isCollapsedRight} />
                </ResizablePanel>
            </ResizablePanelGroup>

        </div>


    );
};

export default ProjectView;