import ray

from pydantic import BaseModel

from models.model import generate_model, save_model_to_database
from modules.motto import MottoModule
from ai.ai import AI


class Motto(BaseModel):
    motto: str


@ray.remote
def generate_motto(
    for_who: str,
    doing_what: str,
    additional_info: str,
    project_id: str,
    model_ai: type[AI],
):
    motto_module = MottoModule(model=model_ai())
    motto = generate_model(
        motto_module, for_who, doing_what, additional_info, Motto,
    )
    save_model_to_database(project_id, "motto", motto)
