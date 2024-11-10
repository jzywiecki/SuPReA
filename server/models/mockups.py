from pydantic import BaseModel, Field
from typing import List


class Mockups(BaseModel):
    mockups_urls: List[str] = Field(default_factory=list)

    class Config:
        extra = "forbid"
