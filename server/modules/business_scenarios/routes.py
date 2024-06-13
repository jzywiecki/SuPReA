import os
import server.modules.module.module as modules
import server.utils.openaiUtils as utils
import logging
from server.utils.data import write_to_file

business_json = '''
    {
        "business_scenario": {
            "title": "string",
            "description": "string",
            "features": [
                {"feature_name": "string", "description": "string"},
            ]
        }
    }
'''

query_for_who = "Zaproponuj scenariusz biznesowy dla"
query_doing_what = "planującego założenie startupu IT skupiającego się na"
query_expectations = "Przedstaw go z krótkim opisem. Skup się na części biznesowej projektu. Wynik zwróć w postaci json zgodnie ze schematem: " + business_json + ", wartości pól uzupełnij w języku polskim."

class BusinessModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, msg_type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, msg_type, 4000)
        return response

    def get_content(self, forWho, doingWhat, isMock, **kwargs):
        content = self.make_ai_call(query_for_who + " " + forWho + " " + query_doing_what + " " + doingWhat + " " + query_expectations, {"type": "json_object"})
        print(content)
        return content
