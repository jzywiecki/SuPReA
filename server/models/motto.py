import ray 

from pydantic import BaseModel

from server.models.models import generate_model, save_model_to_database
from server.modules.motto_module.routes import MottoModule


class MottoModel(BaseModel):
    motto: str


@ray.remote
def generate_motto(for_who: str, doing_what: str, additional_info: str, project_id: str, collection):
    motto = generate_model(MottoModule, for_who, doing_what, additional_info, MottoModel)
    save_model_to_database(project_id, collection, "motto", motto)