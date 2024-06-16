import ProjectElement from './ProjectElement';
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Element {
    id: number;
    name: string;
    description: string;
}

interface ProjectElementsListProps {
    elements: Element[];
    isCollapsed: boolean;
}



const ProjectElementsList: React.FC<ProjectElementsListProps> = ({ elements, isCollapsed }) => {
     

    return (
        <ScrollArea className="h-full">
        <div className=''>
            {isCollapsed && (
                <div>
                    {elements.map((element) => (
                        <ProjectElement key={element.id} element={element} />
                    ))}
                </div>
            )}
        </div>
        </ScrollArea>
    );
};

export default ProjectElementsList;