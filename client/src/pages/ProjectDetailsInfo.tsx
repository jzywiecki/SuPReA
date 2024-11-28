import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "@/components/Image";
import { makePictureUrl } from "@/utils/url";

const ProjectDetailsInfo = ({ project }) => {
    if (project.logo) {
        project.logo = makePictureUrl(project.logo);
    }

    if (project.mockup) {
        project.mockup = makePictureUrl(project.mockup);
    }

    return (
        <div className="space-y-4"> {/* Creates space between the cards */}
            {/* Project Title and Logo */}
            <Card className="bg-slate-50 dark:bg-zinc-900 m-5">
                <CardHeader>
                    <CardTitle className="text-2xl">{project.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center p-4">
                    <Image
                        imageURL={project.logo}
                        alt={`${project.name} Logo`}
                    />
                </CardContent>
            </Card>

            {/* Project Owner and Members */}
            <Card className="bg-slate-50 dark:bg-zinc-900 m-5">
                <CardHeader>
                    <CardTitle className="text-lg">Details</CardTitle>
                </CardHeader>
                <CardContent className="flex space-x-4">
                    {/* Owner */}
                    <div className="w-1/3 border-r border-gray-300 px-4">
                        <h3 className="font-semibold text-lg mb-2">Owner</h3>
                        <p className="inline-flex items-center bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                            {project.owner}
                        </p>
                    </div>

                    {/* Members */}
                    <div className="w-2/3 pl-4">
                        <h3 className="font-semibold text-lg mb-2">Members</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.members?.map((member, index) => (
                                <p
                                    key={index}
                                    className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
                                >
                                    {member}
                                </p>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Project Description */}
            <Card className="bg-slate-50 dark:bg-zinc-900 m-5">
                <CardHeader>
                    <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    {project.description ? (
                        <p>{project.description}</p>
                    ) : (
                        <p>No description available.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ProjectDetailsInfo;
