import React from 'react';
import { Separator } from "@/components/ui/separator";

interface ProjectElementProps {
    element: {
        id: number;
        name: string;
        description: string;
    };
}

const ProjectElement: React.FC<ProjectElementProps> = ({ element }) => {
    return (
        <div className="space-y-1 m-4 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground p-3">
            <h4 className="text-sm font-medium leading-none">{element.name}</h4>
            <p className="text-sm text-muted-foreground">
            {element.description}
            </p>
      </div>
    );
};

export default ProjectElement;