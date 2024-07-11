import ray

from pydantic import BaseModel

from server.models.models import generate_model, save_model_to_database
from server.modules.strategy_module.routes import StrategyModule


class StrategyModel(BaseModel):
    strategy: str


@ray.remote
def generate_strategy(for_who: str, doing_what: str, additional_info: str) -> StrategyModel:
    return generate_model(StrategyModule, for_who, doing_what, additional_info, StrategyModel)


@ray.remote
def save_strategy_to_database(project_id: str, collection, field_name : str, model: StrategyModel):
    save_model_to_database(project_id, collection, "strategy", model)