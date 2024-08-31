from pydantic import BaseModel


class Motto(BaseModel):
    motto: str
