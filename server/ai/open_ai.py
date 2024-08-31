from openai import OpenAI
from utils.decorators import singleton, override

from ai.ai import AI

client = OpenAI()


class GPT35Turbo(AI):
    @override
    def make_ai_call(self, query):
        messages = [{"role": "system", "content": query, "type": "json_object"}]
        params = {"model": "gpt-3.5-turbo", "messages": messages, "max_tokens": 4000}
        response = client.chat.completions.create(**params)
        return response.choices[0].message.content


class DallE3(AI):
    @override
    def make_ai_call(self, query):
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
    def parse_generate_query(self, what, for_who, doing_what, additional_info, expected_answer_format):
        """specific query for DallE3 to generate a picture"""
        return f"Make {what} for {for_who} creating app for {doing_what} " \
               f"additional information: {additional_info}"

    @override
    def parse_update_query(self, what, previous_val, changes_request, expected_answer_format):
        """specific query for DallE3 to update a picture"""
        return f"Create a {what} making: {changes_request} expected format: {expected_answer_format}"