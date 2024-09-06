from pydantic import BaseModel


class UpdateComponentByAIRequest(BaseModel):
    project_id: str
    query: str
