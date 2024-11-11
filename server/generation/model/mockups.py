"""
This module contains the MockupsGenerate class, which is responsible for generating a mockups model.
"""

import ray

from .base_picture_generation import BasePictureGeneration
from pydantic import BaseModel
from models import Mockups
from models import ComponentIdentify
from ai import ai_call_task, AI
from utils.decorators import override


expected_format = """
    Picture should contains mockups of your product. Don't put additional content on picture instead of mockups.
"""


class MockupsGenerate(BasePictureGeneration):
    """
    A concrete implementation of the Generate class for generating and updating mockups models
    """

    def __init__(self):
        """
        Initializes the `MockupsGenerate` instance
        """
        super().__init__(Mockups, "mockups", expected_format, ComponentIdentify.MOCKUPS, 1024, 1024)

    @override
    def generate_by_ai(
        self, ai_model: AI, for_what: str, doing_what: str, additional_info: str
    ) -> BaseModel | None:
        """
        Specify implementation for generating a model using the AI image-model.
        """
        request = ai_model.parse_generate_query(
            self.what,
            for_what,
            doing_what,
            additional_info,
            self.expected_format,
        )

        values_from_ai = process_ai_requests(ai_model, request)
        self.value = self.model_class(urls=values_from_ai)
        return self.value

    @override
    def update_by_ai(self, ai_model: AI, changes_request: str) -> BaseModel | None:
        """
        Specify implementation for updating a model using the AI image-model.
        """
        if self.value is None:
            raise ValueError("Value is None")

        request = ai_model.parse_update_query(
            self.what,
            "",
            changes_request,
            expected_format,
        )

        values_from_ai = process_ai_requests(ai_model, request)
        self.value = self.model_class(urls=values_from_ai)
        return self.value


def process_ai_requests(ai_model: AI, request):
    """
    Process the AI requests and return the results.
    """
    replies = []
    for i in range(1):
        replies.append(ai_call_task.remote(ai_model, request))

    values = []
    for reply in replies:
        values.append(ray.get(reply))

    return values
