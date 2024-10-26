import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useParams } from "react-router-dom";
import { API_URLS } from "@/services/apiUrls";
import axiosInstance from "@/services/api";
import InviteModal from '@/components/InviteModal';
import Search from '@/components/Search';
import { useUser } from '@/components/UserProvider';
import { User } from '@/pages/SearchAndAddFriends';

interface ProjectSettings {
    name: string;
    description: string;
    readme: string;
    owner: Members | null; 
    members: Members[];
    managers: Members[];
    additional_info: string;
    for_who: string;         
    doing_what: string; 
}

interface Members {
    username: string;
    id: string;
    name: string;
    email: string;
}

const ProjectSettings: React.FC = () => {
    const { user } = useUser();
    const { projectID } = useParams();
    const [loading, setLoading] = useState(true);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [allMembers, setAllMembers] = useState<Members[]>([]); 

    const openInviteModal = () => {
        setIsInviteModalOpen(true);
    };

    const closeInviteModal = () => {
        setIsInviteModalOpen(false);
    };

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
            additional_info: "",
            for_who: "",
            doing_what: "",
            owner: null, 
            members: [],
            managers: [],
        },
    });

    const handleSearch = async (searchQuery: string) => {
        try {
            const response = await axiosInstance.get<User[]>(`${API_URLS.BASE_URL}/users/filter?user_id=${user?.id}&filter=${searchQuery}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    // Fetch current project settings
    useEffect(() => {
        const fetchProjectSettings = async () => {
            try {
                const response = await axiosInstance.get(`${API_URLS.API_SERVER_URL}/projects/${projectID}`);
                const projectData = response.data;

                const membersResponse = await axiosInstance.get(`${API_URLS.BASE_URL}/users/projects/${projectID}`);
                const usersData = membersResponse.data as Members[];
                setAllMembers(usersData); 
                console.log(usersData);
                
                setValue("name", projectData.name || "");
                setValue("description", projectData.description || "");
                setValue("readme", projectData.readme || "");
                setValue("additional_info", projectData.additional_info || ""); 
                setValue("for_who", projectData.for_who || "");                 
                setValue("doing_what", projectData.doing_what || "");           
                setValue("owner", usersData.find(member => member.id === projectData.owner) || null);
                setValue("members", usersData || []);
                setValue("managers", projectData.managers.map(managerId => usersData.find(member => member.id === managerId)).filter(Boolean) || []);

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
            const patchData = {
                name: data.name,
                description: data.description,
                readme: data.readme,
            };

            const url = `${API_URLS.API_SERVER_URL}/projects/${projectID}`;
            await axiosInstance.patch(url, patchData);
            console.log("Project settings updated successfully");
        } catch (error) {
            console.error('Error submitting project settings:', error);
        }
    };

    const handleAddMember = async (friendId: string) => {
        try {
            const url = `${API_URLS.API_SERVER_URL}/projects/${projectID}/members/add`;
            console.log(user?.id, friendId)
            await axiosInstance.post(url, { sender_id: user?.id, member_id: friendId });
            closeInviteModal();
        } catch (error) {
            console.error('Error adding member:', error);
        }
    };

    const handleManagerSelect = async (manager: Members) => {
        const currentManagers = control._formValues.managers || [];
        if (!currentManagers.find((m: Members) => m.id === manager.id)) {
            try {
                const url = `${API_URLS.API_SERVER_URL}/projects/${projectID}/managers/assign`;
                await axiosInstance.post(url, { sender_id: user?.id, member_id: manager.id });
    
                // If the request succeeds, update the local form state
                setValue("managers", [...currentManagers, manager]);
            } catch (error) {
                console.error('Error adding manager:', error);
            }
        }
    };


    const handleManagerRemove = async (managerId: string) => {
        try {
            const url = `${API_URLS.API_SERVER_URL}/projects/${projectID}/managers/unassign`;
            await axiosInstance.post(url, { sender_id: user?.id, member_id: managerId });

            // If the request succeeds, update the local form state
            setValue("managers", (control._formValues.managers || []).filter((manager: Members) => manager.id !== managerId));
        } catch (error) {
            console.error('Error removing manager:', error);
        }
    };

    const handleMemberRemove = async (memberId: string) => {
        try {
            const url = `${API_URLS.API_SERVER_URL}/projects/${projectID}/members/remove`;
            await axiosInstance.post(url, { sender_id: user?.id, member_id: memberId });
            
            // Update the local state after successfully removing the member
            setValue("members", (control._formValues.members || []).filter(member => member.id !== memberId));
        } catch (error) {
            console.error('Error removing member:', error);
        }
    };

    const handleOwnerSelect = async (ownerID: Members) => {
        try {
            const url = `${API_URLS.API_SERVER_URL}/projects/${projectID}/owner/assign`;
            await axiosInstance.post(url, { sender_id: user?.id, member_id: ownerID.id });
            
            // Update the local state after successfully removing the member
            setValue("owner", (control._formValues.owner || []));
        } catch (error) {
            console.error('Error removing member:', error);
        }
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
                <Label htmlFor="for_who" className="block text-sm font-medium text-gray-700">For who</Label>
                <Textarea
                    id="for_who"
                    {...register("for_who")}
                    placeholder="Enter readme content"
                    className="mt-1 block w-full"
                />
            </div>

            <div>
                <Label htmlFor="doing_what" className="block text-sm font-medium text-gray-700">Doing what</Label>
                <Textarea
                    id="doing_what"
                    {...register("doing_what")}
                    placeholder="Enter readme content"
                    className="mt-1 block w-full"
                />
            </div>

            <div>
                <Label htmlFor="additional_info" className="block text-sm font-medium text-gray-700">Additional info</Label>
                <Textarea
                    id="additional_info"
                    {...register("additional_info")}
                    placeholder="Enter readme content"
                    className="mt-1 block w-full"
                />
            </div>

            <div>
                <Label htmlFor="owner" className="block text-sm font-medium text-gray-700">Owner</Label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="mt-1 w-full">
                            {control._formValues.owner ? control._formValues.owner.username : "Select Owner"}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {allMembers.length > 0 ? (
                            allMembers.map((member) => (
                                <DropdownMenuItem
                                    key={member.id}
                                    onClick={() => handleOwnerSelect(member)}
                                >
                                    {member.username}
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem disabled>No members available</DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div>
                <Label htmlFor="members" className="block text-sm font-medium text-gray-700">Members</Label>
                <Button className="mt-1 w-full" onClick={openInviteModal}>Add Members</Button>
                <div className="mt-2">
                    {(control._formValues.members || []).map((member, index) => (
                        <span key={index} className="inline-flex items-center bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full mr-2">
                            {member.username}
                            <button onClick={() => handleMemberRemove(member.id)} className="ml-1 text-red-500 hover:text-red-700">&times;</button>
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
                        {allMembers.length > 0 ? (
                            allMembers
                                // Filter out members who are already selected as managers
                                .filter((member) => !(control._formValues.managers || []).some((m) => m.id === member.id))
                                .map((member) => (
                                    <DropdownMenuItem
                                        key={member.id}
                                        onClick={() => handleManagerSelect(member)}
                                    >
                                        {member.username}
                                    </DropdownMenuItem>
                                ))
                        ) : (
                            <DropdownMenuItem disabled>No members available</DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="mt-2">
                    {(control._formValues.managers || []).map((manager, index) => (
                        <span key={index} className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full mr-2">
                            {manager.username}
                            <button onClick={() => handleManagerRemove(manager.id)} className="ml-1 text-red-500 hover:text-red-700">&times;</button>
                        </span>
                    ))}
                </div>
            </div>

            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">Save Settings</Button>
            <InviteModal isOpen={isInviteModalOpen} onClose={closeInviteModal}>
                <Search
                    onSearch={handleSearch}
                    searchResults={searchResults}
                    friends={[]}
                    onClick={handleAddMember}
                    userId={user.id}
                    actionType='addMember'
                />
            </InviteModal>
        </form>
    );
};

export default ProjectSettings;
