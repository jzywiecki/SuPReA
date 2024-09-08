"""
Module contains general high-level functions for generate components using AI models.
"""

import ray

from utils import logger
from .generate import Generate
from .remote import GenerateActor


@ray.remote
def update_component_task(
    project_id, query, ai_model, generate_component_class: type(Generate)
):
    """
    Updates a component using the AI model using ray.
    """
    update_component = GenerateActor.remote(generate_component_class())

    try:
        _, err = ray.get(update_component.fetch_from_database.remote(project_id))
        if err:
            raise err

        _, err = ray.get(update_component.update_by_ai.remote(ai_model, query))
        if err:
            raise err

        _, err = ray.get(update_component.save_to_database.remote(project_id))
        if err:
            raise err

    except Exception as e:
        logger.error(f"Error while remote updating model: {e}")
