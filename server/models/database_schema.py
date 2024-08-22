import ray

from typing import List, Optional
from pydantic import BaseModel

from models.model import generate_model, save_model_to_database
from modules.database_schema import DatabaseSchemaModule
from ai.ai import AI


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
    tables: List[Table]
    relationships: List[Relationship]


@ray.remote
def generate_database_schema(
    for_who: str,
    doing_what: str,
    additional_info: str,
    project_id: str,
    model_ai: type[AI],
):
    database_schema = generate_model(
        DatabaseSchemaModule,
        for_who,
        doing_what,
        additional_info,
        DatabaseSchema,
        model_ai,
    )
    save_model_to_database(project_id, "database_schema", database_schema)
