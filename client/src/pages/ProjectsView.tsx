import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import 'tailwindcss/tailwind.css';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useUser } from '@/components/UserProvider';
import axiosInstance from '@/services/api';
import { API_URLS } from '@/services/apiUrls';

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

type ProjectResponse = {
    owner: Project[];
    member: Project[];
};

const ProjectsView = () => {
    const { user } = useUser();
    const [projects, setProjects] = useState<ProjectResponse>({ owner: [], member: [] });
    const [loading, setLoading] = useState(true);  // Loading state to handle the data fetching process

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axiosInstance.get(`${API_URLS.API_SERVER_URL}/projects/list/${user?.id}`);
                console.log(response.data); // Log the response data to check its structure
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setProjects({ owner: [], member: [] }); // Ensure empty arrays on error
            } finally {
                setLoading(false); // Stop loading after the request is complete
            }
        };

        fetchProjects();
    }, [user?.id]);

    if (loading) {
        return <div className="p-6">Loading projects...</div>; // Display a loading message while data is being fetched
    }

    if ((!projects.owner.length && !projects.member.length)) {
        return <div className="p-6">No projects available.</div>; // Display a message if no projects are found
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Projects</h1>

            {/* Show owned projects */}
            {projects.owner.length > 0 && (
                <>
                    <h2 className="text-xl font-semibold mb-2">Owned Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {projects.owner.map((project) => (
                            <Card key={project.id} className="w-[350px]">
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
                                    <Link to={`/projects/${project.id}`}>
                                        <Button>Show project</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </>
            )}

            {/* Show member projects */}
            {projects.member.length > 0 && (
                <>
                    <h2 className="text-xl font-semibold mb-2">Member Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.member.map((project) => (
                            <Card key={project.id} className="w-[350px]">
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
                                    <Link to={`/projects/${project.id}`}>
                                        <Button>Show project</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ProjectsView;
