import ray

from pydantic import BaseModel

from models.model import generate_model, save_model_to_database
from modules.elevator_speech import ElevatorSpeechModule
from ai.ai import AI


class ElevatorSpeech(BaseModel):
    content: str


@ray.remote
def generate_elevator_speech(
    for_who: str,
    doing_what: str,
    additional_info: str,
    project_id: str,
    model_ai: type[AI],
):
    elevator_speech_module = ElevatorSpeechModule(model=model_ai())
    elevator_speech = generate_model(
        elevator_speech_module,
        for_who,
        doing_what,
        additional_info,
        ElevatorSpeech,
    )
    save_model_to_database(project_id, "elevator_speech", elevator_speech)
