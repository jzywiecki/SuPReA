"""
This module provides the core abstractions and tools for working with AI models.
It defines an abstract base class for AI models and includes a utility function
for making remote calls to AI models using the Ray framework.
"""

import abc
import ray


class AI(metaclass=abc.ABCMeta):
    """
    Abstract class represents AI models. Each AI model should implement this class.
    """

    @abc.abstractmethod
    def name(self):
        """
        :return: the name of the AI model.
        :rtype: str
        """
        raise NotImplementedError

    @abc.abstractmethod
    def make_ai_call(self, query: str):
        """
        Generates a response from an AI model.

        :param str query: The query to be sent to the AI model.

        :return: The response from the AI model.
        :rtype: str
        """
        raise NotImplementedError

    def parse_generate_query(
        self, what: str, for_who: str, doing_what: str, additional_info: str, expected_answer_format: str
    ):
        """
        Creates a query for an AI model to generate a specific item. This query is used by the AI model to
        generate the desired output based on the provided parameters. Derived AI models can override this
        method to customize the query format.

        :param str what: The item to be generated (e.g., actors)
        :param str for_who: Specifies the intended recipient of the application (provided by user.)
        :param str doing_what: Specifies the purpose of the application (provided by user.)
        :param str additional_info: Additional information about the application (provided by user.)
        :param str expected_answer_format: The expected format of the response (default is JSON schema).

        :return: component query for AI model.
        :rtype: str
        """

        return f"""
            Generate {what} for {for_who} creating app for {doing_what}.
            Result return EXACTLY according to provided below json schema (do NOT CHANGE the convention from the given json! 
            DO NOT generate Bulleted List! GENERATE JSON): 
            {expected_answer_format}.
            Additional information: {additional_info}
        """

    def parse_update_query(
        self, what: str, previous_val: str, changes_request: str, expected_answer_format: str
    ):
        """
        Generates a query for an AI model to update an existing item. This query is used by the AI model to
        apply the specified changes to the item. Derived AI models can override this method to customize the
        query format.

        :param str what: The item to be updated, such as actors or components.
        :param str previous_val: The previous value of the item before the update.
        :param str changes_request: The changes to be applied to the item.
        :param str expected_answer_format: The format in which the AI model's response should be returned, usually a JSON schema.

        :return: A query string formatted according to the AI model’s requirements, ready to be sent to the AI model.
        :rtype: str
        """
        return f"""
            Update {what} from: {previous_val}.
            making the following changes: {changes_request}.
            Result return EXACTLY according to provided below json schema (do NOT CHANGE the convention from the given json! 
            DO NOT generate Bulleted List! GENERATE JSON): 
            {expected_answer_format}.
        """


@ray.remote
def ai_call_task(ai_model, query):
    """
    Remote wrapper to call to the AI model.
    """
    return ai_model.make_ai_call(query)
