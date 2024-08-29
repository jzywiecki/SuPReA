import ray

from pydantic import BaseModel
from typing import List

from models.model import generate_model, save_model_to_database
from modules.logo import LogoModule
from ai.ai import AI


class Logo(BaseModel):
    logo_urls: List[str]


@ray.remote
def generate_logo(
    for_who: str,
    doing_what: str,
    additional_info: str,
    project_id: str,
    model_ai: type[AI],
):
    logo_module = LogoModule(model=model_ai())
    motto = generate_model(
        logo_module, for_who, doing_what, additional_info, Logo,
    )
    save_model_to_database(project_id, "logo", motto)
