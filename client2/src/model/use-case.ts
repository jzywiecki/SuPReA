export type UseCase = {
    description: string;
};

export type ActorUseCasesMapping = {
    actor_name: string;
    use_cases: UseCase[];
};

export type UseCases = {
    actor_use_cases: ActorUseCasesMapping[];
};
