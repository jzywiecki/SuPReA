import os
import server.modules.module.module as modules
import server.utils.openaiUtils as utils
import logging
from server.utils.data import write_to_file

business_json = """
    {
        "business_scenario": {
            "title": "string",
            "description": "string",
            "features": [
                {"feature_name": "string", "description": "string"},
            ]
        }
    }
"""

query_for_who = "Suggest a business scenario for "
query_doing_what = "creating app for"
query_expectations = (
    "Show it with short description and features. Return the result in json format according to the schema:"
    + business_json
)


class BusinessModule(modules.Module):
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
