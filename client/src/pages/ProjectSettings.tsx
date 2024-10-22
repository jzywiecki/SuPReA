import { useParams } from "react-router-dom";

const ProjectsSettings = () => {
    const { projectID } = useParams();

    return (
        <div>
           Settings of project {projectID} 
        </div>
    )
}

export default ProjectsSettings;