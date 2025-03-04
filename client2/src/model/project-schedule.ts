export type Milestone = {
    name: string;
    description: string;
    duration: string;
};

export type ProjectSchedule = {
    milestones: Milestone[];
};
