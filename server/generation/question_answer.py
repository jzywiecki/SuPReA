"""
This module provides methods for asking the AI about a project task.
"""

import ray

from utils import logger
from ai import AI
from database import project_dao
import callback.realtime_server as realtime_server


@ray.remote
def ask_ai_about_project_task(question: str, project_id: str, ai_model: AI, callback: str):
    try:
        project_basic_details = project_dao.get_project_model_and_basic_information(project_id)
        question_with_project_details = f"Question: {question} Project details: {project_basic_details}"
        response = ai_model.make_ai_call(question_with_project_details)
        realtime_server.send_question_answer(response, callback)

    except Exception as e:
        logger.error(f"Error during generating answer for project. Details: {e}")
