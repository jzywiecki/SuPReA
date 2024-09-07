"""
This module contains implementations of AI models from OpenAI.

Instances of these models are created as singletons:
 - gpt_35_turbo: An instance of the GPT-3.5 Turbo model.
 - dall_e_3: An instance of the DALL-E 3 model.

These instances ensure that only one instance of each model exists
"""

from openai import OpenAI
from utils.decorators import override

from ai.ai import AI

client = OpenAI()


class GPT35Turbo(AI):
    @override
    def name(self):
        return "GPT-3.5 Turbo"

    @override
    def make_ai_call(self, query: str):
        """Make a call to the GPT-3.5 Turbo model and return the response."""
        messages = [{"role": "system", "content": query, "type": "json_object"}]
        params = {"model": "gpt-3.5-turbo", "messages": messages, "max_tokens": 4000}
        response = client.chat.completions.create(**params)
        return response.choices[0].message.content


class DallE3(AI):
    @override
    def name(self):
        return "DALL-E 3"

    @override
    def make_ai_call(self, query: str):
        """Make a call to the DALL-E 3 model and return the response."""
        params = {
            "model": "dall-e-3",
            "prompt": query,
            "size": "1024x1024",
            "quality": "standard",
            "n": 1,
        }
        response = client.images.generate(**params)
        return response.data[0].url

    @override
    def parse_generate_query(
        self, what: str, for_who: str, doing_what: str, additional_info: str, expected_answer_format: str
    ):
        """Make a specific query for DALL-E 3 to generate an image."""
        return (
            f"Make {what} for {for_who} creating app for {doing_what} "
            f"additional information: {additional_info}"
        )

    @override
    def parse_update_query(
        self, what: str, previous_val: str, changes_request: str, expected_answer_format: str
    ):
        """Make a specific query for DALL-E 3 to update an image."""
        return f"Create a {what} making: {changes_request} expected format: {expected_answer_format}"


gpt_35_turbo = GPT35Turbo()
dall_e_3 = DallE3()
