import ray

from pydantic import BaseModel

from models.model import generate_model, save_model_to_database
from modules.strategy_module.routes import StrategyModule


class Strategy(BaseModel):
    strategy: str


@ray.remote
def generate_strategy(for_who: str, doing_what: str, additional_info: str, project_id: str):
    strategy = generate_model(StrategyModule, for_who, doing_what, additional_info, Strategy)
    save_model_to_database(project_id, "strategy", strategy)