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
