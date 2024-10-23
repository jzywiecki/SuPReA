import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_URLS } from "@/services/apiUrls";
import { AxiosInstance } from "axios";
import axiosInstance from "@/services/api";

interface ProjectSettings {
    name: string;
    description: string;
    readme: string;
    owner: string;
    members: string[];
    managers: string[];
}

const managersList = [
    { id: "manager1", name: "Manager One" },
    { id: "manager2", name: "Manager Two" },
    { id: "manager3", name: "Manager Three" },
];

const membersList = [
    { id: "member1", name: "Member One" },
    { id: "member2", name: "Member Two" },
    { id: "member3", name: "Member Three" },
];

const ProjectSettings: React.FC = () => {
    const { projectID } = useParams();
    const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<ProjectSettings>({
        defaultValues: {
            name: "",
            description: "",
            readme: "",
            owner: "",
            members: [],
            managers: [],
        },
    });

    // Fetch current project settings
    useEffect(() => {
        const fetchProjectSettings = async () => {
            try {
                const response = await axiosInstance.get(`${API_URLS.API_SERVER_URL}/projects/${projectID}`);
                const projectData = response.data;
                
                // Ensure members and managers are initialized as arrays
                setValue("name", projectData.name || "");
                setValue("description", projectData.description || "");
                setValue("readme", projectData.readme || "");
                setValue("owner", projectData.owner || "");
                setValue("members", projectData.members || []);
                setValue("managers", projectData.managers || []);
            } catch (error) {
                console.error("Failed to fetch project settings", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectSettings();
    }, [projectID, setValue]);

    const onSubmit = async (data: ProjectSettings) => {
        try {
        } catch (error) {
        }
    };

    const handleManagerSelect = (managerId: string) => {
        setValue("managers", [...new Set([...control._formValues.managers || [], managerId])]);
    };

    const handleManagerRemove = (managerId: string) => {
        setValue("managers", (control._formValues.managers || []).filter(id => id !== managerId));
    };

    const handleMemberRemove = (memberId: string) => {
        setValue("members", (control._formValues.members || []).filter(id => id !== memberId));
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto p-6 bg-white rounded-lg">
            <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</Label>
                <Input
                    id="name"
                    {...register("name", { required: true })}
                    placeholder="Enter project name"
                    className="mt-1 block w-full"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">This field is required</p>}
            </div>

            <div>
                <Label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</Label>
                <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Enter project description"
                    className="mt-1 block w-full"
                />
            </div>

            <div>
                <Label htmlFor="readme" className="block text-sm font-medium text-gray-700">Readme</Label>
                <Textarea
                    id="readme"
                    {...register("readme")}
                    placeholder="Enter readme content"
                    className="mt-1 block w-full"
                />
            </div>

            <div>
                <Label htmlFor="owner" className="block text-sm font-medium text-gray-700">Owner ID</Label>
                <Input
                    id="owner"
                    {...register("owner", { required: true })}
                    placeholder="Owner ObjectId"
                    className="mt-1 block w-full"
                />
                {errors.owner && <p className="text-red-500 text-sm mt-1">This field is required</p>}
            </div>

            <div>
                <Label htmlFor="members" className="block text-sm font-medium text-gray-700">Members</Label>
                <Button className="mt-1 w-full">Add Members</Button>
                <div className="mt-2">
                    {(control._formValues.members || []).map((id, index) => (
                        <span key={index} className="inline-flex items-center bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full mr-2">
                            {id}
                            <button onClick={() => handleMemberRemove(id)} className="ml-1 text-red-500 hover:text-red-700">&times;</button>
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <Label htmlFor="managers" className="block text-sm font-medium text-gray-700">Managers</Label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="mt-1 w-full">Select Managers</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {managersList.length > 0 ? (
                            managersList.map((manager) => (
                                <DropdownMenuItem
                                    key={manager.id}
                                    onClick={() => handleManagerSelect(manager.id)}
                                >
                                    {manager.name}
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem disabled>No managers available</DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="mt-2">
                    {(control._formValues.managers || []).map((id, index) => (
                        <span key={index} className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full mr-2">
                            {id}
                            <button onClick={() => handleManagerRemove(id)} className="ml-1 text-red-500 hover:text-red-700">&times;</button>
                        </span>
                    ))}
                </div>
            </div>

            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">Save Settings</Button>
        </form>
    );
};

export default ProjectSettings;
