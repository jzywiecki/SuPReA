"""
Module contains general high-level functions for generate components using AI models.
"""

import ray

from utils import logger
from ai import AI
from .generate import Generate
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
    update_component = GenerateActor.remote(generate_component_class())

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
def update_component_task(
    project_id: str,
    new_val,
    get_project_dao_ref,
    generate_component_class: type(Generate),
):
    """
    Updates a component by user.
    """
    update_component = GenerateActor.remote(generate_component_class())

    try:
        _, err = ray.get(update_component.update(new_val))
        if err:
            raise err

        _, err = ray.get(
            update_component.save_to_database.remote(get_project_dao_ref, project_id)
        )
        if err:
            raise err

    except Exception as e:
        logger.error(f"Error while remote updating model: {e}")
        raise e


@ray.remote
def regenerate_component_task(
    project_id: str,
    details: str,
    ai_model: AI,
    get_project_dao_ref,
    generate_component_class: type(Generate),
):
    """
    Updates a component using the AI model using ray.
    """
    update_component = GenerateActor.remote(generate_component_class())

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
