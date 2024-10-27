import { CiSettings } from "react-icons/ci";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { FaPlay } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axiosInstance from "@/services/api";
import { API_URLS } from "@/services/apiUrls";
import { useEffect, useState } from "react";
import ProjectDetailsInfo from "./ProjectDetailsInfo";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectDetailsReadme = () => {

    const { projectID } = useParams();
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState(null);

    useEffect(() => {
        try {
            axiosInstance.get(`${API_URLS.API_SERVER_URL}/projects/${projectID}`)
                .then(response => {
                    console.log(response.data)
                    const processedProject = {
                        ...response.data,
                        members: response.data.members.filter(member => member !== response.data.owner),
                    };
                    setProject(processedProject);
                })
                .catch(error => {
                    console.error("There was an error fetching the user data!", error);
                });

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

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