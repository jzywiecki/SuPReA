from typing import List
from pydantic import BaseModel


class UseCase(BaseModel):
    description: str


class ActorUseCasesMapping(BaseModel):
    actor_name: str
    use_cases: List[UseCase]


class UseCases(BaseModel):
    actor_use_cases: List[ActorUseCasesMapping]
