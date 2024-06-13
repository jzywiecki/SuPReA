import json
import os
import server.modules.module.module as modules
import server.utils.openaiUtils as utils
import logging
from server.utils.data import write_to_file
from server.utils.validation import validate_json

harmonogram_json = '''
    "milestones": [
        {
            "name": "string",
            "description": "string",
            "duration": "string"
        }
    ]
'''

query_for_who = "Zaproponuj harmonogram pracy dla"
query_doing_what = "tworzącego aplikację do"
query_expectations = "Przedstaw go z krótkim opisem. Skup się na części biznesowej projektu. Wynik zwróć w postaci json zgodnie ze schematem: " + harmonogram_json + ", wartości pól uzupełnij w języku polskim."

class ScheduleModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, msg_type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, msg_type, 4000)
        return response

    def get_content(self, forWho, doingWhat, isMock, **kwargs):
        content = self.make_ai_call(query_for_who + " " + forWho + " " + query_doing_what + " " + doingWhat + " " + query_expectations, {"type": "json_object"})
        return content