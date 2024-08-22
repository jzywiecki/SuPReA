import ray

from pydantic import BaseModel
from typing import List

from models.model import generate_model, save_model_to_database
from modules.logo import LogoModule
from ai.ai import AI

class Logo(BaseModel):
    logo_urls: List[str]


@ray.remote
def generate_logo(for_who: str, doing_what: str, additional_info: str, project_id: str, model_ai: type[AI]):
    motto = generate_model(LogoModule, for_who, doing_what, additional_info, Logo, model_ai)
    save_model_to_database(project_id, "logo", motto)
