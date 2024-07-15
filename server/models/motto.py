import ray

from pydantic import BaseModel

from models.model import generate_model, save_model_to_database
from modules.motto_module.routes import MottoModule


class Motto(BaseModel):
    motto: str


@ray.remote
def generate_motto(for_who: str, doing_what: str, additional_info: str, project_id: str):
    motto = generate_model(MottoModule, for_who, doing_what, additional_info, Motto)
    save_model_to_database(project_id, "motto", motto)
