import abc
import ray


class AI(metaclass=abc.ABCMeta):
    """
    Abstract class represents AI models.
    """

    @abc.abstractmethod
    def name(self):
        """Returns the name of the AI model."""
        raise NotImplementedError

    @abc.abstractmethod
    def make_ai_call(self, query):
        """
        Generates a response from an AI model.

        Args:
            query (str): The query to be sent to the AI model.

        Returns:
            str: The response from the AI model.
        """
        raise NotImplementedError

    def parse_generate_query(
        self, what, for_who, doing_what, additional_info, expected_answer_format
    ):
        """
        Generates a query to GENERATE model to use in AI model. Derived AI models can override this method
        to provide a custom query format.

        Args:
            what (str): The item to be generated (e.g., actors).
            for_who (str): Specifies the intended recipient of the application (provided by user.).
            doing_what (str): Describes the application's purpose or activity (provided by the user).
            additional_info (str): Any additional information about application (provided by the user).
            expected_answer_format (str): The expected format of the response (default should be JSON schema).

        Returns:
            str: A default query format for AI model.
        """

        return f"""
            Generate {what} for {for_who} creating app for {doing_what}.
            Result return EXACTLY according to provided below json schema (do NOT CHANGE the convention from the given json! 
            DO NOT generate Bulleted List! GENERATE JSON): 
            {expected_answer_format}.
            Additional information: {additional_info}
        """

    def parse_update_query(
        self, what, previous_val, changes_request, expected_answer_format
    ):
        """
        Generates a query to UPDATE model to use in AI model. Derived AI models can override this method
        to provide a custom query format.

        Args:
            what (str): The item to be updated (e.g., actors).
            previous_val (str): The previous value of the item.
            changes_request (str): The changes to be made to the item.
            expected_answer_format (str): The expected format of the response (default should be JSON schema).
        """
        return f"""
            Update {what} from: {previous_val}.
            making the following changes: {changes_request}.
            Result return EXACTLY according to provided below json schema (do NOT CHANGE the convention from the given json! 
            DO NOT generate Bulleted List! GENERATE JSON): 
            {expected_answer_format}.
        """


@ray.remote
def ai_call_remote(ai_model, query):
    """
    Makes a remote call to the AI model.
    """
    return ai_model.make_ai_call(query)
