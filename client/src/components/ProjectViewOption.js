import React from "react";


const ProjectViewOption = ( {option} ) => {

    return (
        <div className="flex items-center gap-2 ml-5">
            <span className="text-xl">[ x ]</span>
            <span className="text-xl font-semibold">{option}</span>
        </div>
    );
}

export default ProjectViewOption;