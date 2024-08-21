import ray

from typing import List
from pydantic import BaseModel

from models.model import generate_model, save_model_to_database
from modules.title.routes import TitleModule


class Title(BaseModel):
    names: List[str]


@ray.remote
def generate_title(for_who: str, doing_what: str, additional_info: str, project_id: str):
    title = generate_model(TitleModule, for_who, doing_what, additional_info, Title)
    save_model_to_database(project_id, "tite", title)
