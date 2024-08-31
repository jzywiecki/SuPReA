import abc
import json
from database import save_model, get_model


class Module(metaclass=abc.ABCMeta):
    """
    Represents a abstraction layer that can be used to generate, update a model and save it to the database.
    Derived AI models can override this method to provide a custom requirements.
    """
    def __init__(self, model_class, name, expected_format):
        """
        Initializes the module with the model class, name, and expected format.

        Args:
            model_class (class):
                The model class to be used (e.g., BusinessScenarios).
            name (str):
                The name of the model (e.g., actors).
            expected_format (str):
                The expected format of the model (e.g., correct JSON schema).

        Attributes:
            value: The model object.
            status: The last status of the model (can be used to send status messages).
            exception: The last occurred exception.
        """
        self.model_class = model_class
        self.name = name
        self.expected_format = expected_format
        self.value = None
        self.status = None
        self.exception = None

    def generate_by_ai(self, ai_model, for_what, doing_what, additional_info):
        """Generates a model using the AI model."""
        try:
            request = ai_model.parse_generate_query(
                self.name, for_what, doing_what, additional_info, self.expected_format
            )

            reply = ai_model.make_ai_call(request)
            reply_json_str = extract_json(reply)
            self.value = self.make_model_from_reply(reply_json_str)

        except Exception as e:
            print(e)
            self.exception = e
            self.status = f"model:{self.name} error:generate_by_ai"
            self.value = None

    def update_by_ai(self, ai_model, changes_request):
        """Update a model using the AI model."""
        try:
            request = ai_model.parse_update_query(self.name, self.value, changes_request, self.expected_format)

            reply = ai_model.make_ai_call(request)
            reply_json_str = self.extract_json(reply)
            self.value = self.make_model_from_reply(reply_json_str)

        except Exception as e:
            print(e)
            self.exception = e
            self.status = f"model:{self.name} error:update_by_ai"

    def save_to_database(self, project_id):
        """Save the provided/generated model to the database for project with id={project_id}."""
        try:
            save_model(project_id, self.name, self.value)
        except Exception as e:
            self.exception = e
            self.status = f"model:{self.name} error:save_to_database"

    def fetch_from_database(self, project_id):
        """Fetch the model from project with id={project_id} from the database."""
        try:
            self.value = get_model(project_id, self.name)
            if self.value is None:
                raise ValueError("value is None")
        except Exception as e:
            self.exception = e
            self.status = f"model:{self.name} error:fetch_from_database"

    def update(self, new_val):
        """Update the model with a new value. Value must be of the correct type."""
        try:
            if not isinstance(new_val, self.model_class):
                raise ValueError("new_val is not of the correct type")
            self.value = new_val

        except Exception as e:
            self.exception = e
            self.status = f"model:{self.name} error:update"
            self.value = None

    def check_errors(self):
        """Returns the status and exception if there is any."""
        return self.status, self.exception

    def get_value(self):
        """Returns the value of the model."""
        return self.value

    def make_model_from_reply(self, reply):
        """Creates a model object from the ai reply"""
        data = json.loads(reply)
        return self.model_class(**data)


def extract_json(text):
    """
    Find the first occurrence of '{' and the last occurrence of '}'
    It is used to extract the JSON content from the text.
    """
    start_index = text.find('{')
    end_index = text.rfind('}')

    if start_index != -1 and end_index != -1 and start_index < end_index:
        return text[start_index:end_index + 1]

    return None

