import json
import os
import modules.module.module as modules
import utils.openaiUtils as utils
import logging
from utils.data import write_to_file
from utils.validation import validate_json

elevator_speech_json = """
    "content": "string"
"""

query_for_who = "Make a elevator pitch for"
query_doing_what = "creating app for"
query_expectations = (
    "Show it with short description. Return the result in json format according to the schema:"
    + elevator_speech_json
)


class ElevatorSpeechModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, msg_type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, msg_type, 4000)
        return response

    def get_content(self, for_who, doing_what, additional_info, is_mock, **kwargs):
        text_response = self.make_ai_call(
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
        return text_response
