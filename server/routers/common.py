"""
This module contains the request and response models for the common API endpoints.
"""

from pydantic import BaseModel


class RegenerateComponentByAIRequest(BaseModel):
    """
    The request object for regenerating a component using AI-based generation.
    """

    details: str
    ai_model: str
    callback: str
