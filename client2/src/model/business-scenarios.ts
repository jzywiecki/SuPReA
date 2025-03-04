export type Feature = {
    feature_name: string;
    description: string;
};

export type BusinessScenario = {
    title: string;
    description: string;
    features: Feature[];
};

export type BusinessScenarios = {
    business_scenario?: BusinessScenario;
};
