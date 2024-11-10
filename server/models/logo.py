from pydantic import BaseModel, Field
from typing import List


class Logo(BaseModel):
    logo_urls: List[str] = Field(default_factory=list)
