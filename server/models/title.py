from typing import List
from pydantic import BaseModel


class Title(BaseModel):
    names: List[str]
