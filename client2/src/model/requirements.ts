export type FunctionalRequirement = {
    name: string;
    description: string;
    priority: string;
};

export type NonFunctionalRequirement = {
    name: string;
    description: string;
    priority: string;
};

export type Requirements = {
    functional_requirements: FunctionalRequirement[];
    non_functional_requirements: NonFunctionalRequirement[];
};
