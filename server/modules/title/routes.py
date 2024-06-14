import json
import os
import server.modules.module.module as modules
import server.utils.openaiUtils as utils
import logging
from server.utils.data import write_to_file
from server.utils.validation import validate_json

title_json = """
    "names": ["string"]
"""

query_for_who = "Suggest 10 names for"
query_doing_what = "creating app for"
query_expectations = "Result return according to provided json schema: " + title_json


class TitleModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, msg_type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, msg_type, 4000)
        return response

    def get_content(self, for_who, doing_what, additional_info, is_mock, **kwargs):
        content = self.make_ai_call(
            query_for_who
            + " "
            + for_who
            + " "
            + query_doing_what
            + " "
            + doing_what
            + " "
            + query_expectations
            + " "
            + additional_info,
            {"type": "json_object"},
        )
        return content
