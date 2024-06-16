import React from 'react';
import { Link } from 'react-router-dom';

interface ProjectElementProps {
    element: {
        id: number;
        name: string;
        description: string;
    };
}

const ProjectElement: React.FC<ProjectElementProps> = ({ element }) => {
    const path = element.name.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="space-y-1 m-4 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground p-3">
            <Link to={path}>
            <div className="text-sm font-medium leading-none">{element.name}</div>
            <p className="text-sm text-muted-foreground">
            {element.description}
            </p>
            </Link>
      </div>
    );

};

export default ProjectElement;