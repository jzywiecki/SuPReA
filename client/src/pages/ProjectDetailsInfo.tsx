import { API_URLS } from "@/services/apiUrls";
import { makePictureUrl } from "@/utils/url";
import Image from "@/components/Image";


const ProjectDetailsInfo = ({ project }) => {

    if (project.logo) {
        project.logo = makePictureUrl(project.logo);
    }

    const defaultLogoURL = 'https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg';

    return (<div style={{ height: "100%" }}>
        <div className="project-element-readme-box box-name">
            <h2>{project.name}</h2>
            {project.logo ? (
        <Image 
          imageURL={project.logo} 
          alt={`${project.name} Logo`} 
          classname="w-24 h-24 object-contain" 
        />
      ) : (
        <img 
          src={defaultLogoURL} 
          alt="Default Logo" 
          className="w-24 h-24 object-contain" 
        />
      )}        </div>

        <div className="project-element-readme-box box-description flex space-x-4 border border-gray-300 p-4 rounded-lg">
            <div className="w-1/3 border-r border-gray-300 pr-4 flex items-center align-center">
                {project.description ? (
                    <p>{project.description}</p>
                ) : (
                    <p>There is no description yet. Start project to create it!</p>
                )}
            </div>

            <div className="w-1/3 border-r border-gray-300 px-4">
                <h3 className="font-semibold text-lg mb-2">Owner</h3>
                <p className="inline-flex items-center bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                    {project.owner}
                </p>
            </div>

            <div className="w-1/3 pl-4">
                <h3 className="font-semibold text-lg mb-2">Members</h3>
                {project.members?.map((member, index) => (
                    <p key={index} className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full mb-2">
                        {member.username}
                    </p>))}
            </div>
        </div>
        <div className="project-element-readme-box box-images">
            <div className="project-element-readme-box-image-container">
                {(project.motto && project.motto.motto) ? <p>{project.motto.motto}</p> : <p>No motto available. Run project and generate your unique motto</p>}
                <img src='https://contentdrips.com/wp-content/uploads/2023/08/Image-gen-scrnshot-3-1024x1024.png'></img>
            </div>
            <div className="project-element-readme-box-image-container">
                <img src='https://uizard.io/blog/content/images/2023/08/Screenshot-2023-08-25-at-11.33.57.png'></img>
                {(project.elevator_speech && project.elevator_speech.content) ? <p>{project.elevator_speech.content}</p> : <p>Create your personal elevator speech inside project</p>}
            </div>
        </div>

    </div>
    );
};
export default ProjectDetailsInfo;