import { CiSettings } from "react-icons/ci";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { FaPlay } from "react-icons/fa";
import ProjectDetailsInfo from "./ProjectDetailsInfo";

const ProjectDetails = ({ project }) => {

    if (!project) return <p>Select a project to view details</p>; //TODO: style this

    return (
        <ScrollArea className="h-[calc(100vh-5rem)] bg-[#f1f1f1] pt-4" >
            <div className="project-element-readme-header">
                <div>
                    <Link to={`/projects/${project.id}/editor`}>
                        <Button style={{ backgroundColor: "green", marginRight: "10px" }}><p style={{ marginRight: "10px" }}>Start</p><FaPlay /></Button>
                    </Link>
                    <Link to={`/projects/${project.id}/settings`}>
                        <CiSettings size={20} />
                    </Link>

                </div>
                <p className="project-element-readme-date"> {new Date(project.created_at).toLocaleDateString("pl-PL", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })}</p>
            </div>
            <ProjectDetailsInfo project={project} />

        </ScrollArea>
    );
};
export default ProjectDetails;