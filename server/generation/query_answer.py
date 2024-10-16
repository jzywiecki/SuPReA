import ray

from utils import logger
from ai import AI
from database import ProjectDAO


@ray.remote
def answer_the_question_by_ai_task(question: str, ai_model: AI, callback: str | None):
    try:
        pass
    except Exception as e:
        logger.error(f"Error while remote regenerating model by ai: {e}")
