import ray

from pydantic import BaseModel

from models.model import generate_model, save_model_to_database
from modules.strategy import StrategyModule
from ai.ai import AI


class Strategy(BaseModel):
    strategy: str


@ray.remote
def generate_strategy(
    for_who: str,
    doing_what: str,
    additional_info: str,
    project_id: str,
    model_ai: type[AI],
):
    strategy = generate_model(
        StrategyModule, for_who, doing_what, additional_info, Strategy, model_ai
    )
    save_model_to_database(project_id, "strategy", strategy)
