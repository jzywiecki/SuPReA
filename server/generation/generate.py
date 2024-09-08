"""
Module containing the Generate class, which provides an abstraction layer for generating, updating, and saving models
to the database.
"""

import abc
import json
from database import ProjectDAO
from models import ComponentIdentify
from ai import AI


class Generate(metaclass=abc.ABCMeta):
    """
    An abstract class that provides an abstraction layer for generating, updating, and saving models to the database.

    Derived AI models can override the methods to provide custom requirements.
    """

    def __init__(
        self, model_class, what: str, expected_format: str, component_identify: ComponentIdentify
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

    def generate_by_ai(self, ai_model: AI, for_what: str, doing_what: str, additional_info: str):
        """
        Generates a model using the AI model.

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

    def update_by_ai(self, ai_model: AI, changes_request: str):
        """
        Updates a model using the AI model.

        :param ai_model: The AI model to be used for updating.
        :type ai_model: AI
        :param changes_request: The changes to be made to the existing model.
        :type changes_request: str

        :return: The updated model.
        :rtype: model_class

        :raises ValueError: If the AI model response cannot be parsed or is not valid.
        """
        request = ai_model.parse_update_query(
            self.what, self.value, changes_request, self.expected_format
        )

        reply = ai_model.make_ai_call(request)
        reply_json_str = extract_json(reply)
        self.value = make_model_from_reply(self.model_class, reply_json_str)

        return self.value

    def save_to_database(self, project_dao: ProjectDAO, project_id: str):
        """
        Saves the generated or updated model to the database.

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

    def fetch_from_database(self, project_dao: ProjectDAO, project_id: str):
        """
        Fetches the model from the database for a given project ID.

        :param project_dao: The DAO object for the project.
        :type project_dao: ProjectDAO
        :param project_id: The ID of the project from which to fetch the model.
        :type project_id: str

        :return: The fetched model.
        :rtype: model_class

        :raises ProjectNotFound: If the project with the specified ID does not exist.
        """
        self.value = project_dao.get_project_component(
            project_id, self.component_identify.value
        )

        return self.value

    def update(self, new_val):
        """
        Updates the model with a new value.

        :param new_val: The new value to set for the model.
        :type new_val: model_class

        :return: The updated model.
        :rtype: model_class

        :raises ValueError: If the new value is not of the correct type.
        """
        if not isinstance(new_val, self.model_class):
            raise ValueError("new val is not of the correct type")
        self.value = new_val

        return self.value

    def get_value(self):
        """
        Returns the current value of the model.

        :return: The value of the model.
        :rtype: model_class
        """
        return self.value

    def get_component_identify(self):
        """
        Returns the component identification.

        :return: The component identification.
        :rtype: ComponentIdentify
        """
        return self.component_identify

    def get_what(self):
        """
        Returns the description of what is being generated or updated.

        :return: The description of the model's purpose.
        :rtype: str
        """
        return self.what


def extract_json(text):
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


def make_model_from_reply(model_class, reply):
    """
    Creates a model object from the AI reply.

    :param model_class: The class of the model to create.
    :type model_class: class
    :param reply: The AI reply containing model data in JSON format.
    :type reply: str

    :return: The created model object.
    :rtype: model_class
    """
    data = json.loads(reply)
    return model_class(**data)
