"""
Module contains general high-level functions for generate components using AI models.
"""

import ray

from utils import logger
from ai import AI
from .generate import Generate
from .generate import GenerateWithMonitor
from .generate import GenerateActor


@ray.remote
def update_component_by_ai_task(
    project_id: str,
    query: str,
    ai_model: AI,
    get_project_dao_ref,
    generate_component_class: type(Generate),
):
    """
    Updates a component using the AI model using ray.
    """
    generate_with_monitor = GenerateWithMonitor(generate_component_class())
    update_component = GenerateActor.remote(generate_with_monitor)

    try:
        _, err = ray.get(
            update_component.fetch_from_database.remote(get_project_dao_ref, project_id)
        )
        if err:
            raise err

        _, err = ray.get(update_component.update_by_ai.remote(ai_model, query))
        if err:
            raise err

        _, err = ray.get(
            update_component.save_to_database.remote(get_project_dao_ref, project_id)
        )
        if err:
            raise err

    except Exception as e:
        logger.error(f"Error while remote updating model by ai: {e}")


@ray.remote
def regenerate_component_by_ai_task(
    project_id: str,
    details: str,
    ai_model: AI,
    get_project_dao_ref,
    generate_component_class: type(Generate),
):
    """
    Updates a component using the AI model using ray.
    """
    generate_with_monitor = GenerateWithMonitor(generate_component_class())
    update_component = GenerateActor.remote(generate_with_monitor)

    try:
        _, err = ray.get(update_component.regenerate_by_ai.remote(ai_model, details))
        if err:
            raise err

        _, err = ray.get(
            update_component.save_to_database.remote(get_project_dao_ref, project_id)
        )
        if err:
            raise err

    except Exception as e:
        logger.error(f"Error while remote regenerating model by ai: {e}")
