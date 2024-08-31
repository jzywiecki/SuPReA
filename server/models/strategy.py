from pydantic import BaseModel


class Strategy(BaseModel):
    strategy: str
