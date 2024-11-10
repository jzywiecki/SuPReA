"""
This module contains the LogoGenerate class, which is responsible for generating a logo model.
"""

import ray
from pydantic import BaseModel

from generation.generate import Generate
from models import Logo
from utils.decorators import override
from ai import ai_call_task, AI
from models import ComponentIdentify


expected_format = """
    The image is a single logo with no additional content! Don't put additional content on picture instead of logo.
"""

additional_details1 = (
    " The logo should be simple and colorful. The whole background should be white."
)
additional_details2 = (
    " The logo should be simple and not colorful. The whole background should be white."
)
additional_details3 = (
    " The logo should be for children. The whole background should be white. "
)
additional_details4 = (
    " The logo should be funny. The whole background should be white. "
)


class LogoGenerate(Generate):
    """
    A concrete implementation of the Generate class for generating and updating logo models.
    """

    def __init__(self):
        """
        Initializes the `LogoGenerate` instance.
        """
        super().__init__(Logo, "logo", expected_format, ComponentIdentify.LOGO)

    @override
    def generate_by_ai(
        self, ai_model: AI, for_what: str, doing_what: str, additional_info: str
    ) -> BaseModel | None:
        """
        Specify implementation for generating a model using the AI image-model.
        """
        request1 = ai_model.parse_generate_query(
            self.what,
            for_what,
            doing_what,
            additional_details1,
            self.expected_format,
        )
        request2 = ai_model.parse_generate_query(
            self.what,
            for_what,
            doing_what,
            additional_details2,
            self.expected_format,
        )
        request3 = ai_model.parse_generate_query(
            self.what,
            for_what,
            doing_what,
            additional_details3,
            self.expected_format,
        )
        request4 = ai_model.parse_generate_query(
            self.what,
            for_what,
            doing_what,
            additional_details4,
            self.expected_format,
        )

        list_value = process_ai_requests(
            ai_model, request1, request2, request3, request4
        )
        self.value = make_model_from_reply(self.model_class, list_value)

        return self.value

    @override
    def update_by_ai(self, ai_model: AI, changes_request: str) -> BaseModel | None:
        """
        Specify implementation for updating a model using the AI image-model.
        """
        if self.value is None:
            raise ValueError("Value is None")

        request1 = ai_model.parse_update_query(
            self.what, "", changes_request, self.expected_format
        )
        # request2 = ai_model.parse_update_query(
        #     self.what, "", changes_request, self.expected_format
        # )
        # request3 = ai_model.parse_update_query(
        #     self.what, "", changes_request, self.expected_format
        # )
        # request4 = ai_model.parse_update_query(
        #     self.what, "", changes_request, self.expected_format
        # )

        list_value = process_ai_requests(
            ai_model, request1, #request2, request3, request4
        )
        self.value = make_model_from_reply(self.model_class, list_value)

        return self.value


def process_ai_requests(ai_model: AI, *requests):
    """
    Process the AI requests and return the results.
    """
    replies = []
    for request in requests:
        replies.append(ai_call_task.remote(ai_model, request))

    results = ray.get(replies)

    return results


def make_model_from_reply(model_class, reply):
    """
    Create a model from the AI reply.
    """
    return model_class(logo_urls=reply)
