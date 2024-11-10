from typing import List, Optional
from pydantic import BaseModel, Field


class Column(BaseModel):
    name: str
    type: str
    primary_key: Optional[bool] = False
    foreign_key: Optional[str] = None


class Table(BaseModel):
    name: str
    columns: List[Column]


class Relationship(BaseModel):
    from_table: str
    to_table: str
    relationship_type: str
    on_column: str


class DatabaseSchema(BaseModel):
    tables: List[Table] = Field(default_factory=list)
    relationships: List[Relationship] = Field(default_factory=list)

    class Config:
        extra = "forbid"
