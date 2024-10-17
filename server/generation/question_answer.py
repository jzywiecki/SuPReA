"""
This module provides methods for asking the AI about a project task.
Callback will be forwarded in the notify message to the realtime server.
"""

import ray

from utils import logger
from ai import AI
import callback.realtime_server as realtime_server


@ray.remote
def ask_ai_about_project_task(question: str, project_id: str, ai_model: AI, get_project_dao_ref, callback: str):
    try:
        project_dao = get_project_dao_ref()
        project_basic_details = project_dao.get_project_model_and_basic_information(project_id)
        question_with_project_details = f"Question: {question}. " \
                                        f"Make short answer please. " \
                                        f"Project details: {project_basic_details}"
        response = ai_model.make_ai_call(question_with_project_details)
        realtime_server.send_question_answer(response, callback)

    except Exception as e:
        logger.error(f"Error during generating answer for project. Details: {e}")
