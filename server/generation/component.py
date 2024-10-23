"""
Module contains general high-level functions for generate components using AI models.
Callback will be forwarded in the notify message to the realtime server.
"""

import ray

from utils import logger
from ai import AI
from .generate import Generate
from .generate import GenerateWithMonitor
from .generate import GenerateActor
import callback.realtime_server as realtime_server


@ray.remote
def update_component_by_ai_task(
    project_id: str,
    query: str,
    ai_model: AI,
    get_project_dao_ref,
    generate_component_class: type(Generate),
    callback: str,
) -> None:
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

        component_identify = ray.get(update_component.get_component_identify.remote())
        component_value = ray.get(update_component.get_value.remote())
        realtime_server.notify_update_complete(
            component_identify.value, component_value.json(), callback
        )

    except Exception as e:
        logger.error(f"Error while remote updating model by ai: {e}")


@ray.remote
def regenerate_component_by_ai_task(
    details: str, ai_model: AI, generate_component_class: type(Generate), callback: str
) -> None:
    """
    Updates a component using the AI model using ray.
    """
    generate_with_monitor = GenerateWithMonitor(generate_component_class())
    update_component = GenerateActor.remote(generate_with_monitor)

    try:
        _, err = ray.get(update_component.regenerate_by_ai.remote(ai_model, details))
        if err:
            raise err

        component_identify = ray.get(update_component.get_component_identify.remote())
        component_value = ray.get(update_component.get_value.remote())
        realtime_server.notify_regeneration_complete(
            component_identify.value, component_value.json(), callback
        )

    except Exception as e:
        logger.error(f"Error while remote regenerating model by ai: {e}")
