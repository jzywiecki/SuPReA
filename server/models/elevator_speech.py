from pydantic import BaseModel


class ElevatorSpeech(BaseModel):
    content: str = ""
