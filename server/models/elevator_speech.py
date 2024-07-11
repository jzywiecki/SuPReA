import ray

from pydantic import BaseModel

from server.models.models import generate_model, save_model_to_database
from server.modules.elevator_speech.routes import ElevatorSpeechModule


class ElevatorSpeechModel(BaseModel):
    content: str


@ray.remote
def generate_elevator_speech(for_who: str, doing_what: str, additional_info: str) -> ElevatorSpeechModel:
    return generate_model(ElevatorSpeechModule, for_who, doing_what, additional_info, ElevatorSpeechModel)


@ray.remote
def save_elevator_speech_to_database(project_id: str, collection, model: ElevatorSpeechModel):
    save_model_to_database(project_id, collection, "elevator_speech", model)