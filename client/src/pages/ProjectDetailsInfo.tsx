import { makePictureUrl } from "@/utils/url";
import Image from "@/components/Image";


const ProjectDetailsInfo = ({ project }) => {

    if (project.logo) {
        project.logo = makePictureUrl(project.logo);
    }

    if (project.mockup) {
        project.mockup = makePictureUrl(project.mockup);
    }

    console.log(project);

    return (<div style={{ height: "100%" }}>
        <div className="project-element-readme-box box-name dark:bg-zinc-900">
            <h2>{project.name}</h2>
        <Image 
          imageURL={project.logo} 
          alt={`${project.name} Logo`} 
          classname="w-24 h-24 object-contain" 
        />
       </div>

        <div className="project-element-readme-box box-description flex space-x-4 p-4 dark:bg-zinc-900">


            <div className="w-1/3 border-r border-gray-300 px-4">
                <h3 className="font-semibold text-lg mb-2">Owner</h3>
                <p className="inline-flex items-center bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                    {project.owner}
                </p>
            </div>

            <div className="w-1/3 pl-4">
            <h3 className="font-semibold text-lg mb-2">Members</h3>
<div className="flex flex-wrap gap-2">  {/* flexbox z marginesem pomiędzy elementami */}
    {project.members?.map((member, index) => (
        <p key={index} className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
            {member}
        </p>
    ))}
</div>
            </div>
        </div>
        <div className="project-element-readme-box box-images dark:bg-zinc-900">
            <div className="">
            <h3 className="font-semibold text-lg mb-2">Description</h3>
                {(project.description) ? <p>{project.description}</p> : <p>No description available.</p>}
            </div>
        </div>

    </div>
    );
};
export default ProjectDetailsInfo;