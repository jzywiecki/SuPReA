import ray

from typing import List
from pydantic import BaseModel

from server.models.models import generate_model, save_model_to_database
from server.modules.actors.routes import ActorsModule


class ActorModel(BaseModel):
    name: str
    description: str


class ActorsModel(BaseModel):
    actors: List[ActorModel]


@ray.remote
def generate_actors(for_who: str, doing_what: str, additional_info: str) -> ActorsModel:
    return generate_model(ActorsModule, for_who, doing_what, additional_info, ActorsModel)


@ray.remote
def save_actors_to_database(project_id, collection, model: ActorsModel):
    save_model_to_database(project_id, collection, "actors", model)