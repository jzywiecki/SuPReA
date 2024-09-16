"""
This module contains the request and response models for the common API endpoints.
"""

from pydantic import BaseModel


class UpdateComponentByAIRequest(BaseModel):
    """
    The request object for updating a component using AI-based generation.
    """

    project_id: str
    query: str
    ai_model: str


class RegenerateComponentByAIRequest(BaseModel):
    """
    The request object for regenerating a component using AI-based generation.
    """

    project_id: str
    details: str
    ai_model: str
