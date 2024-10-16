"""
Service for asking questions to the AI.
"""

from utils import InvalidParameter
from ai import get_text_model_remote_ref_enum
from generation.query_answer import answer_the_question_by_ai_task

def serve_ask_ai_question(request):
    if not request.content:
        raise InvalidParameter("Content cannot be empty")

    if not request.ai_model:
        raise InvalidParameter("AI model cannot be empty")

    if not request.callback:
        raise InvalidParameter("Callback cannot be empty")

    aiModel = get_text_model_remote_ref_enum(request.ai_model)

    answer_the_question_by_ai_task.remote(request.content, aiModel, request.callback)
