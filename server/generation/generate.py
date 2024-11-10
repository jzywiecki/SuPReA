"""
Module containing:
- Generate class, which provides a basic layer for generating, updating, and saving models to the database.
- GenerateWithMonitor class, which adds logging functionality and controlled exceptions to the Generate class.
- GenerateActor class, which is a remote wrapper for the Generate and GenerateWithMonitor class.
"""

import ray
import abc
import json

from pydantic import ValidationError, BaseModel
from pymongo.results import UpdateResult

from database import ProjectDAO
from models import ComponentIdentify
from ai import AI
from utils import logger_ai, logger_db, logger, WrongFormatGeneratedByAI
from utils import RayUnexpectedException


class Generate(metaclass=abc.ABCMeta):
    """
    A class that provides a basic layer for generating, updating, and saving models to the database.
    This class don't provide log and error management.

    Derived AI models can override the methods to provide custom requirements.
    """

    def __init__(
        self,
        model_class,
        what: str,
        expected_format: str,
        component_identify: ComponentIdentify,
    ):
        """
        Initializes the Generate class with model class, description, expected format, and component identification.

        :param model_class: The class of the model to be used (e.g., BusinessScenarios).
        :param what: Describes what is being generated or updated (e.g., actors).
        :type what: str
        :param expected_format: The expected format of the model (e.g., correct JSON schema).
        :type expected_format: str
        :param component_identify: Indicates what component is being generated or updated.
        :type component_identify: ComponentIdentify
        """
        self.model_class = model_class
        self.what = what
        self.expected_format = expected_format
        self.component_identify = component_identify
        self.value = None

    def generate_by_ai(
        self, ai_model: AI, for_what: str, doing_what: str, additional_info: str
    ) -> BaseModel | None:
        """
        Generates a model component using the AI model.

        :param ai_model: The AI component to be used for generation.
        :type ai_model: AI
        :param for_what: Specifies the application or context for which the model is generated.
        :type for_what: str
        :param doing_what: Describes the purpose of the generated model.
        :type doing_what: str
        :param additional_info: Any additional information that may be needed for component generation.
        :type additional_info: str

        :return: The generated component.
        :rtype: model_class

        :raises ValueError: If the AI model response cannot be parsed or is not valid.
        """
        request = ai_model.parse_generate_query(
            self.what, for_what, doing_what, additional_info, self.expected_format
        )

        reply = ai_model.make_ai_call(request)
        reply_json_str = extract_json(reply)
        self.value = make_model_from_reply(self.model_class, reply_json_str)

        return self.value

    def regenerate_by_ai(self, ai_model: AI, details: str) -> BaseModel | None:
        """
        Generates a model component using the AI model.
        Method is similar to generate_by_ai, but it is more flexible.

        :param ai_model: The AI component to be used for generation.
        :type ai_model: AI
        :param details: information for component generation
        :type details: str

        :return: The generated component.
        :rtype: model_class

        :raises ValueError: If the AI model response cannot be parsed or is not valid.
        """
        request = ai_model.parse_regenerate_query(
            self.what, details, self.expected_format
        )

        reply = ai_model.make_ai_call(request)
        reply_json_str = extract_json(reply)
        self.value = make_model_from_reply(self.model_class, reply_json_str)

        return self.value

    def update_by_ai(self, ai_model: AI, changes_request: str) -> BaseModel | None:
        """
        Updates a model component using the AI model.

        :param ai_model: The AI model to be used for updating.
        :type ai_model: AI
        :param changes_request: The changes to be made to the existing model.
        :type changes_request: str

        :return: The updated model.
        :rtype: model_class

        :raises ValueError: If the AI model response cannot be parsed or is not valid.
        """
        if self.value is None:
            raise ValueError("Model value is not set")

        request = ai_model.parse_update_query(
            self.what, self.value.__dict__, changes_request, self.expected_format
        )

        reply = ai_model.make_ai_call(request)
        reply_json_str = extract_json(reply)
        self.value = make_model_from_reply(self.model_class, reply_json_str)

        return self.value

    def save_to_database(
        self, project_dao: ProjectDAO, project_id: str
    ) -> UpdateResult:
        """
        Saves the generated or updated model component to the database.

        :param project_dao: The DAO object for the project.
        :type project_dao: ProjectDAO
        :param project_id: The ID of the project to which the model is to be saved.
        :type project_id: str

        :return: The result of the database update operation.
        :rtype: bool

        :raises ValueError: If the model value is not set or invalid.
        """
        return project_dao.update_project_component(
            project_id, self.component_identify.value, self.value
        )

    def fetch_from_database(
        self, project_dao: ProjectDAO, project_id: str
    ) -> BaseModel | None:
        """
        Fetches the model component from the database for a given project ID.

        :param project_dao: The DAO object for the project.
        :type project_dao: ProjectDAO
        :param project_id: The ID of the project from which to fetch the model.
        :type project_id: str

        :return: The fetched model.
        :rtype: model_class
        """
        value_from_db = project_dao.get_project_component(
            project_id, self.component_identify.value
        )

        if value_from_db:
            self.value = self.model_class(**value_from_db)
        else:
            self.value = None

        return self.value

    def update(self, new_val) -> BaseModel | None:
        """
        Updates the model component with a new value.

        :param new_val: The new value to set for the model.
        :type new_val: model_class or None

        :return: The updated model.
        :rtype: model_class

        :raises ValueError: If the new value is not of the correct type.
        """
        if new_val is not None and not isinstance(new_val, self.model_class):
            raise ValueError("new val is not of the correct type")
        self.value = new_val

        return self.value

    def get_value(self) -> BaseModel | None:
        """
        Returns the current value of the model component.

        :return: The value of the model.
        :rtype: model_class
        """
        return self.value

    def get_component_identify(self) -> ComponentIdentify:
        """
        Returns the component identification.

        :return: The component identification.
        :rtype: ComponentIdentify
        """
        return self.component_identify

    def get_what(self) -> str:
        """
        Returns the description of what is being generated or updated.

        :return: The description of the model's purpose.
        :rtype: str
        """
        return self.what

    def default_value(self) -> BaseModel:
        """
        Sets the default value for the model component.
        """
        self.value = self.model_class()
        return self.value


def extract_json(text) -> str:
    """
    Extracts the JSON content from a text.

    Finds the first occurrence of '{' and the last occurrence of '}' to extract the JSON.

    :param text: The text from which to extract JSON.
    :type text: str

    :return: The extracted JSON string.
    :rtype: str
    """
    start_index = text.find("{")
    end_index = text.rfind("}")

    if start_index != -1 and end_index != -1 and start_index < end_index:
        return text[start_index : end_index + 1]

    return text


def make_model_from_reply(model_class, reply) -> BaseModel:
    """
    Creates a model component object from the AI reply.

    :param model_class: The class of the model to create.
    :type model_class: class
    :param reply: The AI reply containing model data in JSON format.
    :type reply: str

    :return: The created model object.
    :rtype: model_class
    """
    data = json.loads(reply)
    return model_class(**data)


class GenerateWithMonitor:
    """
    A subclass of Generate that adds logging functionality and controlled exceptions.
    """

    def __init__(self, model_generate: Generate):
        """
        Initializes the `GenerateActor` instance.
        """
        self.model_generate = model_generate

    def generate_by_ai(
        self, ai_model: AI, for_what: str, doing_what: str, additional_info: str
    ) -> BaseModel | None:
        """
        Generates a model using the AI model and logs the process.
        """
        try:
            self.model_generate.generate_by_ai(
                ai_model, for_what, doing_what, additional_info
            )

            logger_ai.info(
                f"Finished successfully.",
                extra={
                    "ai_model": ai_model.name(),
                    "component": self.model_generate.what,
                },
            )

            return self.model_generate.get_value()

        except (json.JSONDecodeError, ValidationError, ValueError) as e:
            logger_ai.exception(
                f"{e}",
                extra={
                    "ai_model": ai_model.name(),
                    "component": self.model_generate.what,
                },
            )

            raise WrongFormatGeneratedByAI()

        except BaseException as e:
            logger_ai.error(
                f"{e}",
                extra={
                    "ai_model": ai_model.name(),
                    "component": self.model_generate.what,
                },
            )

            raise e

    def regenerate_by_ai(self, ai_model: AI, details: str) -> BaseModel | None:
        """
        Generates a model using the AI model and logs the process.
        """
        try:
            self.model_generate.regenerate_by_ai(ai_model, details)

            logger_ai.info(
                f"Finished successfully.",
                extra={
                    "ai_model": ai_model.name(),
                    "component": self.model_generate.what,
                },
            )
            return self.model_generate.get_value()

        except (json.JSONDecodeError, ValidationError, ValueError) as e:
            logger_ai.exception(
                f"{e}",
                extra={
                    "ai_model": ai_model.name(),
                    "component": self.model_generate.what,
                },
            )

            raise WrongFormatGeneratedByAI()

        except BaseException as e:
            logger_ai.error(
                f"{e}",
                extra={
                    "ai_model": ai_model.name(),
                    "component": self.model_generate.what,
                },
            )

            raise e

    def update_by_ai(self, ai_model: AI, changes_request: str) -> BaseModel | None:
        """
        Update a model using the AI model and logs the process.
        """
        try:
            self.model_generate.update_by_ai(ai_model, changes_request)

            logger_ai.info(
                f"Finished successfully.",
                extra={
                    "ai_model": ai_model.name(),
                    "component": self.model_generate.what,
                },
            )

            return self.model_generate.get_value()

        except (json.JSONDecodeError, ValidationError, ValueError) as e:
            logger_ai.exception(
                f"{e}",
                extra={
                    "ai_model": ai_model.name(),
                    "component": self.model_generate.what,
                },
            )

            raise WrongFormatGeneratedByAI()

        except BaseException as e:
            logger_ai.error(
                f"{e}",
                extra={
                    "ai_model": ai_model.name(),
                    "component": self.model_generate.what,
                },
            )

            raise e

    def save_to_database(
        self, project_dao: ProjectDAO, project_id: str
    ) -> UpdateResult:
        """
        Save the provided/generated model to the database for project with id={project_id}.
        Methods logs the process.
        """
        try:
            res = self.model_generate.save_to_database(project_dao, project_id)

            logger_db.info(
                f"Finished successfully.",
                extra={
                    "project_id": project_id,
                    "field": self.model_generate.component_identify.value,
                },
            )
            return res

        except BaseException as e:
            logger_db.error(
                f"{e}",
                extra={
                    "project_id": project_id,
                    "field": self.model_generate.component_identify.value,
                },
            )

            raise e

    def fetch_from_database(
        self, project_dao: ProjectDAO, project_id: str
    ) -> BaseModel | None:
        """
        Fetch the model from project with id={project_id} from the database.
        Methods logs the process.
        """
        try:
            self.model_generate.fetch_from_database(project_dao, project_id)

            logger_db.info(
                f"Finished successfully.",
                extra={
                    "project_id": project_id,
                    "field": self.model_generate.component_identify.value,
                },
            )
            return self.model_generate.get_value()

        except BaseException as e:
            logger_db.error(
                f"{e}",
                extra={
                    "project_id": project_id,
                    "field": self.model_generate.component_identify.value,
                },
            )
            raise e

    def update(self, new_val) -> BaseModel | None:
        """
        Update the model with a new value. Value must be of the correct type.
        Method logs the process.
        """
        try:
            self.model_generate.update(new_val)
            return self.model_generate.get_value()

        except BaseException as e:
            logger.exception(f"{e}")
            raise e

    def get_value(self) -> BaseModel | None:
        """
        Returns the value of the model.
        """
        return self.model_generate.get_value()

    def get_component_identify(self) -> ComponentIdentify:
        """
        Returns the component identify.
        """
        return self.model_generate.get_component_identify()

    def default_value(self) -> BaseModel:
        """
        Update the model with a new value. Value must be of the correct type.
        Method logs the process.
        """
        try:
            return self.model_generate.default_value()

        except BaseException as e:
            logger.exception(f"{e}")
            raise e


@ray.remote
class GenerateActor:
    """
    class which is a remote wrapper for the Generate and GenerateWithMonitor class.
    """

    def __init__(self, model_generate: Generate):
        """
        Initializes the `GenerateActor` instance.
        """
        self.model_generate = model_generate

    def __init__(self, model_generate: GenerateWithMonitor):
        """
        Initializes the `GenerateActor` instance.
        """
        self.model_generate = model_generate

    def generate_by_ai(
        self, ai_model: AI, for_what: str, doing_what: str, additional_info: str
    ):
        """
        Generates a model using the AI model.
        returns the current actor ref and an error if any.
        """
        try:
            self.model_generate.generate_by_ai(
                ai_model, for_what, doing_what, additional_info
            )

            return self.current_actor(), None

        except BaseException as e:
            return self.current_actor(), RayUnexpectedException(str(e))

    def regenerate_by_ai(self, ai_model: AI, details: str):
        """
        Generates a model using the AI model.
        returns the current actor ref and an error if any.
        """
        try:
            self.model_generate.regenerate_by_ai(ai_model, details)

            return self.current_actor(), None

        except BaseException as e:
            return self.current_actor(), RayUnexpectedException(str(e))

    def update_by_ai(self, ai_model: AI, changes_request: str):
        """
        Update a model using the AI model.
        returns the current actor ref and an error if any.
        """
        try:
            self.model_generate.update_by_ai(ai_model, changes_request)

            return self.current_actor(), None

        except BaseException as e:
            return self.current_actor(), RayUnexpectedException(str(e))

    def save_to_database(self, get_project_dao_ref, project_id: str):
        """
        Save the provided/generated model to the database for project with id={project_id}.
        returns the actor ref and an error if any.
        """
        try:
            self.model_generate.save_to_database(get_project_dao_ref(), project_id)

            return self.current_actor(), None

        except BaseException as e:
            return self.current_actor(), RayUnexpectedException(str(e))

    def fetch_from_database(self, get_project_dao_ref, project_id: str):
        """
        Fetch the model from project with id={project_id} from the database.

        returns the actor ref and an error if any.
        """
        try:
            self.model_generate.fetch_from_database(get_project_dao_ref(), project_id)

            return self.current_actor(), None

        except BaseException as e:
            return self.current_actor(), RayUnexpectedException(str(e))

    def update(self, new_val):
        """
        Update the model with a new value. Value must be of the correct type.

        returns the actor ref and an error if any.
        """
        try:
            self.model_generate.update(new_val)

            return self.current_actor(), None

        except BaseException as e:
            return self.current_actor(), RayUnexpectedException(str(e))

    def get_value(self):
        """
        Returns the value of the model.
        """
        return self.model_generate.get_value()

    def get_component_identify(self):
        """
        Returns the component identify.
        """
        return self.model_generate.get_component_identify()

    def default_value(self):
        """
        Returns the component identify.
        """
        try:
            return self.model_generate.default_value(), None

        except BaseException as e:
            return self.current_actor(), RayUnexpectedException(str(e))

    def current_actor(self):
        """
        Returns the current ray actor reference
        """
        return ray.get_runtime_context().current_actor
