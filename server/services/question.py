"""
Service for asking questions to the AI.
"""

from utils import InvalidParameter
from ai import get_text_model_remote_ref_enum
from generation.question_answer import ask_ai_about_project_task
from database import get_project_dao_ref


def serve_ask_ai_question(request):
    if not request.content:
        raise InvalidParameter("Content cannot be empty")

    if not request.ai_model:
        raise InvalidParameter("AI model cannot be empty")

    if not request.callback:
        raise InvalidParameter("Callback cannot be empty")

    if not request.project_id:
        raise InvalidParameter("Project ID cannot be empty")

    aiModel = get_text_model_remote_ref_enum(request.ai_model)

    ask_ai_about_project_task.remote(request.content, request.project_id, aiModel, get_project_dao_ref, request.callback)
