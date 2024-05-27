import React from "react";
import ProjectViewOption from "../components/ProjectViewOption";

const ProjectView = () => {
    return (
        <div class="flex h-screen">
            <div class="flex w-full">
                <aside class="flex-col w-2/12 align-center">
                    <h1 class="text-2xl font-semibold ml-5">Project title</h1>
                    <ProjectViewOption option="Data model" />
                    <ProjectViewOption option="Specifications" />
                    <ProjectViewOption option="Requirements" />
                    <ProjectViewOption option="Actors and Risks" />
                    <ProjectViewOption option="UML diagrams" />
                    <ProjectViewOption option="Classes" />
                    <ProjectViewOption option="Logo" />
                    <ProjectViewOption option="Name" />
                </aside>
                <div class="w-7/12 bg-green-500">
                    a
                </div>
                <div class="w-3/12 bg-red-500">
                    c
                </div>
            </div>
        </div>
    );
}

export default ProjectView;