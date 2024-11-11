from pydantic import BaseModel, Field
from typing import List


class Attribute(BaseModel):
    name: str
    type: str


class Method(BaseModel):
    name: str
    return_type: str


class Relationship(BaseModel):
    type: str
    target: str


class UMLDiagramClass(BaseModel):
    name: str
    attributes: list[Attribute]
    methods: list[Method]
    relationships: list[Relationship]


class UMLDiagramClasses(BaseModel):
    uml_diagram_class: List[UMLDiagramClass] = Field(default_factory=list)

    class Config:
        extra = "forbid"
