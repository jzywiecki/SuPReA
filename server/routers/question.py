"""
This module defines the API routes for interacting with AI models.
It provides an endpoint for submitting questions to the AI and receiving responses.
"""

from fastapi import APIRouter, status, Response
from services import serve_ask_ai_question
from pydantic import BaseModel
from utils import verify_project_membership


router = APIRouter(
    tags=["model"],
    prefix="/model",
)


class QuestionRequest(BaseModel):
    content: str
    callback: str
    ai_model: str
    project_id: str


@router.post(
    "/ai-question",
    status_code=status.HTTP_200_OK,
)
def ask_ai_question(request: QuestionRequest):
    serve_ask_ai_question(request)
    return Response(status_code=status.HTTP_200_OK)
