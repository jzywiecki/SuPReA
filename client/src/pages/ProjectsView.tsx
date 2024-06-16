import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
    CardFooter,
  } from "@/components/ui/card"
import 'tailwindcss/tailwind.css';
import { Button } from "@/components/ui/button";
type Project = {
    id: string;
    name: string;
    description: string;
    created_at: string;
    additional_info: string;
    doing_what: string;
    for_who: string;
    owner: string;
    members: string[];
    actors: {
        actors: string[];
    };
    business_scenarios: {
        business_scenario: Record<string, unknown>;
    };
    elevator_speech: {
        content: string;
    };
    motto: {
        motto: string;
    };
    project_schedule: {
        milestones: Record<string, unknown>[];
    };
    requirements: {
        functional_requirements: Record<string, unknown>[];
        non_functional_requirements: Record<string, unknown>[];
    };
    risks: {
        risks: Record<string, unknown>[];
    };
    specifications: {
        specifications: Record<string, unknown>[];
    };
    strategy: {
        strategy: string;
    };
    title: {
        names: string[];
    };
}; 

const ProjectsView = () => {
    const [projects, setProjects] = useState<{ projects: Project[] }>({ projects: [] });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:8000/projects');
                console.log(response.data); // Log the response data to check its structure
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
                // setProjects([]);
            }
        };

        fetchProjects();
    }, []);


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Projects</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.projects.map((project) => (
                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle>{project.name}</CardTitle>
                            <CardDescription>{project.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Created At:</strong> {new Date(project.created_at).toLocaleDateString()}</p>
                            <p><strong>Owner:</strong> {project.owner}</p>
                            <p><strong>Additional Info:</strong> {project.additional_info}</p>
                            <p><strong>Doing What:</strong> {project.doing_what}</p>
                            <p><strong>For Who:</strong> {project.for_who}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline">Settings</Button>
                            <Button>Show project</Button>
                        </CardFooter>
                    </Card>
            ))}
            </div>
        </div>
    );
};

export default ProjectsView;