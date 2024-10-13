"""
This module contains implementations of AI models from OpenAI.

These instances ensure that only one instance of each model exists
"""

import ray

from openai import OpenAI
from utils.decorators import override

from ai.ai import AI

client = OpenAI()


class GPT(AI):
    """Base class for GPT AI models."""

    def make_ai_call(self, query: str, model_name: str) -> str:
        """Make a call to the GPT model and return the response."""
        messages = [{"role": "system", "content": query, "type": "json_object"}]
        params = {"model": model_name, "messages": messages, "max_tokens": 4000}
        response = client.chat.completions.create(**params)
        return response.choices[0].message.content


class GPT35Turbo(GPT):
    @override
    def name(self) -> str:
        return "GPT-3.5 Turbo"

    @override
    def make_ai_call(self, query: str) -> str:
        """Make a call to the GPT-3.5 Turbo model and return the response."""
        return super().make_ai_call(query, "gpt-3.5-turbo")


class GPT4oMini(GPT):
    @override
    def name(self) -> str:
        return "GPT-4o mini"

    @override
    def make_ai_call(self, query: str) -> str:
        """Make a call to the GPT-4.0 Mini model and return the response."""
        return super().make_ai_call(query, "gpt-4o-mini")


class DallE(AI):
    """Base class for DALL-E AI models."""

    def make_ai_call(self, query: str, model_name: str) -> str:
        """Make a call to the DALL-E 3 model and return the response."""
        params = {
            "model": "dall-e-2",
            "prompt": query,
            "size": "1024x1024",
            "quality": "standard",
            "n": 1,
        }
        response = client.images.generate(**params)
        return response.data[0].url

    @override
    def parse_generate_query(
        self,
        what: str,
        for_who: str,
        doing_what: str,
        additional_info: str,
        expected_answer_format: str,
    ) -> str:
        """Make a specific query for DALL-E 3 to generate an image."""
        return (
            f"Make {what} for {for_who} creating app for {doing_what} "
            f"additional information: {additional_info}"
        )

    @override
    def parse_update_query(
        self,
        what: str,
        previous_val: str,
        changes_request: str,
        expected_answer_format: str,
    ) -> str:
        """Make a specific query for DALL-E to update an image."""
        return f"Generate a {what} details: {changes_request}"

    @override
    def parse_regenerate_query(
        self,
        what: str,
        details: str,
        expected_answer_format: str,
    ) -> str:
        """Make a specific query for DALL-E 3 to regenerate an image."""
        return f"Generate a {what} details: {details}"


class DallE2(DallE):
    @override
    def name(self) -> str:
        return "DALL-E 2"

    @override
    def make_ai_call(self, query: str) -> str:
        """Make a call to the DALL-E 2 model and return the response."""
        return super().make_ai_call(query, "dall-e-2")


class DallE3(DallE):
    @override
    def name(self) -> str:
        return "DALL-E 3"

    @override
    def make_ai_call(self, query: str) -> str:
        """Make a call to the DALL-E 3 model and return the response."""
        return super().make_ai_call(query, "dall-e-3")


gpt_35_turbo = GPT35Turbo()
gpt_4o_mini = GPT4oMini()
dall_e_3 = DallE3()
dall_e_2 = DallE2()

gpt_35_turbo_remote_ref = ray.put(gpt_35_turbo)
gpt_4o_mini_remote_ref = ray.put(gpt_4o_mini)
dall_e_3_remote_ref = ray.put(dall_e_3)
dall_e_2_remote_ref = ray.put(dall_e_2)
