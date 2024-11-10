from pydantic import BaseModel


class Motto(BaseModel):
    motto: str = ""

    class Config:
        extra = "forbid"
