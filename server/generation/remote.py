import json
import ray

from utils import logger_ai, logger_db, logger, WrongFormatGeneratedByAI
from .generate import Generate


@ray.remote
class GenerateActor:
    """Remote actor that generates components by AI, saves them to the database and handles failures.
    This actor is wrapped around the Generate class."""
    def __init__(self, model_generate: Generate):
        self.model_generate = model_generate

    def generate_by_ai(self, ai_model, for_what, doing_what, additional_info):
        """Generates a model using the AI model.
        returns the current actor ref and an error if any."""
        try:
            self.model_generate.generate_by_ai(ai_model, for_what, doing_what, additional_info)

            logger_ai.info(
                f"Finished successfully.",
                extra={"ai_model": ai_model.name(), "component": self.model_generate.what},
            )
            return self.current_actor(), None

        except json.JSONDecodeError as e:
            logger_ai.exception(f"{e}", extra={"ai_model": ai_model.name(), "component": self.model_generate.what})

            return self.current_actor(), WrongFormatGeneratedByAI()

        except Exception as e:
            logger_ai.error(
                f"{e}", extra={"ai_model": ai_model.name(), "component": self.model_generate.what}
            )

            return self.current_actor(), e

    def update_by_ai(self, ai_model, changes_request):
        """Update a model using the AI model.
        returns the current actor ref and an error if any."""
        try:
            self.model_generate.update_by_ai(ai_model, changes_request)

            logger_ai.info(
                f"Finished successfully.",
                extra={"ai_model": ai_model.name(), "component": self.model_generate.what},
            )

            return self.current_actor(), None

        except json.JSONDecodeError as e:
            logger_ai.exception(f"{e}", extra={"ai_model": ai_model.name(), "component": self.model_generate.what})

            return self.current_actor(), WrongFormatGeneratedByAI()

        except Exception as e:
            logger_ai.error(
                f"{e}", extra={"ai_model": ai_model.name(), "component": self.model_generate.what}
            )

            return self.current_actor(), e

    def save_to_database(self, project_id):
        """Save the provided/generated model to the database for project with id={project_id}.
        returns the actor ref and an error if any."""
        try:
            self.model_generate.save_to_database(project_id)

            logger_db.info(
                f"Finished successfully.",
                extra={
                    "project_id": project_id,
                    "field": self.model_generate.component_identify.value,
                },
            )
            return self.current_actor(), None

        except Exception as e:
            logger_db.error(
                f"{e}",
                extra={
                    "project_id": project_id,
                    "field": self.model_generate.component_identify.value,
                },
            )
            return self.current_actor(), e

    def fetch_from_database(self, project_id):
        """Fetch the model from project with id={project_id} from the database.
        returns the actor ref and an error if any."""
        try:
            self.model_generate.fetch_from_database(project_id)

            logger_db.info(
                f"Finished successfully.",
                extra={
                    "project_id": project_id,
                    "field": self.model_generate.component_identify.value,
                },
            )
            return self.current_actor(), None

        except Exception as e:
            logger_db.error(
                f"{e}",
                extra={
                    "project_id": project_id,
                    "field": self.model_generate.component_identify.value,
                },
            )
            return self.current_actor(), e

    def update(self, new_val):
        """Update the model with a new value. Value must be of the correct type.
        returns the actor ref and an error if any."""
        try:
            self.model_generate.update(new_val)
            return self.current_actor(), None

        except Exception as e:
            logger.exception(f"{e}")
            return self.current_actor(), e

    def get_value(self):
        """Returns the value of the model."""
        return self.model_generate.value

    def get_component_identify(self):
        """Returns the component identify."""
        return self.model_generate.component_identify

    def current_actor(self):
        return ray.get_runtime_context().current_actor
