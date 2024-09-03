import abc
import ray
import json
import database.projects as projects_dao
from utils import logger_ai, logger_db, logger, WrongFormatGeneratedByAI
from models import ComponentIdentify


class Module(metaclass=abc.ABCMeta):
    """
    Represents a abstraction layer that can be used to generate, update a model and save it to the database.
    Derived AI models can override this method to provide a custom requirements.
    """

    def __init__(
        self, model_class, what, expected_format, component_identify: ComponentIdentify
    ):
        """
        Initializes the module with the model class, name, and expected format.

        Args:
            model_class (class):
                The model class to be used (e.g., BusinessScenarios).
            what (str):
                what we generate/update (e.g., actors).
            expected_format (str):
                The expected format of the model (e.g., correct JSON schema).
            component_identify (ComponentIdentify):
                field indicates what component is being generated/updated.
        """
        self.model_class = model_class
        self.what = what
        self.expected_format = expected_format
        self.component_identify = component_identify
        self.value = None

    def generate_by_ai(self, ai_model, for_what, doing_what, additional_info):
        """Generates a model using the AI model.
        returns the current actor ref and an error if any."""
        try:
            request = ai_model.parse_generate_query(
                self.what, for_what, doing_what, additional_info, self.expected_format
            )

            reply = ai_model.make_ai_call(request)
            reply_json_str = extract_json(reply)
            self.value = make_model_from_reply(self.model_class, reply_json_str)

            logger_ai.info(
                f"Finished successfully.",
                extra={"ai_model": ai_model.name(), "component": self.what},
            )
            return self.current_actor(), None

        except json.JSONDecodeError as e:
            logger_ai.exception(
                f"{e}, reply={reply}",
                extra={"ai_model": ai_model.name(), "component": self.what},
            )
            return self.current_actor(), WrongFormatGeneratedByAI()

        except Exception as e:
            logger_ai.error(
                f"{e}", extra={"ai_model": ai_model.name(), "component": self.what}
            )
            return self.current_actor(), e

    def update_by_ai(self, ai_model, changes_request):
        """Update a model using the AI model.
        returns the current actor ref and an error if any."""
        try:
            request = ai_model.parse_update_query(
                self.what, self.value, changes_request, self.expected_format
            )

            reply = ai_model.make_ai_call(request)
            reply_json_str = extract_json(reply)
            self.value = make_model_from_reply(self.model_class, reply_json_str)

            logger_ai.info(
                f"Finished successfully.",
                extra={"ai_model": ai_model.name(), "component": self.what},
            )
            return self.current_actor(), None

        except json.JSONDecodeError as e:
            logger_ai.exception(
                f"{e}, reply={reply}",
                extra={"ai_model": ai_model.name(), "component": self.what},
            )
            return self.current_actor(), WrongFormatGeneratedByAI()

        except Exception as e:
            logger_ai.error(
                f"{e}", extra={"ai_model": ai_model.name(), "component": self.what}
            )
            return self.current_actor(), e

    def save_to_database(self, project_id):
        """Save the provided/generated model to the database for project with id={project_id}.
        returns the actor ref and an error if any."""
        try:
            projects_dao.update_project_component(
                project_id, self.component_identify.value, self.value
            )
            logger_db.info(
                f"Finished successfully.",
                extra={
                    "project_id": project_id,
                    "field": self.component_identify.value,
                },
            )
            return self.current_actor(), None

        except Exception as e:
            logger_db.error(
                f"{e}",
                extra={
                    "project_id": project_id,
                    "field": self.component_identify.value,
                },
            )
            return self.current_actor(), e

    def fetch_from_database(self, project_id):
        """Fetch the model from project with id={project_id} from the database.
        returns the actor ref and an error if any."""
        try:
            self.value = projects_dao.get_project_component(
                project_id, self.component_identify.value
            )
            if self.value is None:
                raise ValueError("value is None")
            logger_db.info(
                f"Finished successfully.",
                extra={
                    "project_id": project_id,
                    "field": self.component_identify.value,
                },
            )
            return self.current_actor(), None

        except Exception as e:
            logger_db.error(
                f"{e}",
                extra={
                    "project_id": project_id,
                    "field": self.component_identify.value,
                },
            )
            return self.current_actor(), e

    def update(self, new_val):
        """Update the model with a new value. Value must be of the correct type.
        returns the actor ref and an error if any."""
        try:
            if not isinstance(new_val, self.model_class):
                raise ValueError("new val is not of the correct type")
            self.value = new_val
            return self.current_actor(), None

        except Exception as e:
            logger.exception(f"{e}")
            return self.current_actor(), e

    def get_value(self):
        """Returns the value of the model."""
        return self.value

    def get_component_identify(self):
        """Returns the component identify."""
        return self.component_identify

    def current_actor(self):
        return ray.get_runtime_context().current_actor


def extract_json(text):
    """
    Find the first occurrence of '{' and the last occurrence of '}'
    It is used to extract the JSON content from the text.
    """
    start_index = text.find("{")
    end_index = text.rfind("}")

    if start_index != -1 and end_index != -1 and start_index < end_index:
        return text[start_index : end_index + 1]

    return text


def make_model_from_reply(model_class, reply):
    """Creates a model object from the ai reply"""
    data = json.loads(reply)
    return model_class(**data)
