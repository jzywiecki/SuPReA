import ProjectElement from './ProjectElement';
import React from 'react';

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
        <div className='h-screen'>
            {isCollapsed && (
                <div>
                    {elements.map((element) => (
                        <ProjectElement key={element.id} element={element} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectElementsList;