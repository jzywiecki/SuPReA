import ray

from typing import List
from pydantic import BaseModel

from models.model import generate_model, save_model_to_database
from modules.database_schema.routes import DatabaseSchemaModule


class DatabaseSchema(BaseModel):
    schema: List[dict[str, dict[str, str]]]
    relationships: List[str]


@ray.remote
def generate_database_schema(for_who: str, doing_what: str, additional_info: str, project_id: str):
    database_schema = generate_model(DatabaseSchemaModule, for_who, doing_what, additional_info, DatabaseSchema)
    save_model_to_database(project_id, "database_schema", database_schema)
