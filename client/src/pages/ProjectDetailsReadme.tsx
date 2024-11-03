import { ScrollArea } from "@/components/ui/scroll-area"
import { useParams } from "react-router-dom";
import axiosInstance from "@/services/api";
import { API_URLS } from "@/services/apiUrls";
import { useEffect, useState } from "react";
import ProjectDetailsInfo from "./ProjectDetailsInfo";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/components/UserProvider";
interface Members {
    username: string;
    id: string;
    name: string;
    email: string;
}

const ProjectDetailsReadme = () => {
    const { projectID } = useParams();
    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState(null);

    useEffect(() => {
        const fetchProjectData = async () => {
            try {

                const projectResponse = await axiosInstance.get(`${API_URLS.API_SERVER_URL}/projects/${projectID}`);
                const projectData = projectResponse.data;
                const membersResponse = await axiosInstance.get(`${API_URLS.BASE_URL}/users/projects/${projectID}`);
                const usersData = membersResponse.data as Members[];

                const filteredMembers = usersData.filter(member => member.id !== projectData.owner);

                const processedProject = {
                    ...projectData,
                    members: filteredMembers,
                    owner: user?.username
                };

                setProject(processedProject);
            } catch (error) {
                console.error("Failed to fetch project or members data", error);
            } finally {
                setLoading(false);
            }
        };
        if (user?.id) {
            fetchProjectData();

        }
    }, [projectID, user?.id]);
    const SkeletonLoading = () => (
        <div className="flex justify-center items-around p-3">
            <div className="w-[85%] space-y-3">
                <Skeleton className="h-20 " />
                <Skeleton className="h-40 " />
                <Skeleton className="h-40 " />
            </div>

        </div>
    );
    if (loading || !project?.id) return < SkeletonLoading />;
    return (
        // <p>SS</p>
        <ScrollArea className="project-element-readme-container">
            {/* <div className="project-element-readme-header">
                <p className="project-element-readme-date"> {new Date(project.created_at).toLocaleDateString("pl-PL", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })}</p>
            </div> */}
            <ProjectDetailsInfo project={project} />

        </ScrollArea>
    );
};
export default ProjectDetailsReadme;