from pydantic import BaseModel
from typing import List


class Logo(BaseModel):
    logo_urls: List[str]
