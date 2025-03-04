export type Attribute = {
    name: string;
    type: string;
};

export type Method = {
    name: string;
    return_type: string;
};

export type Relationship = {
    type: string;
    target: string;
};

export type UMLDiagramClass = {
    name: string;
    attributes: Attribute[];
    methods: Method[];
    relationships: Relationship[];
};

export type UMLDiagramClasses = {
    uml_diagram_class: UMLDiagramClass[];
};
