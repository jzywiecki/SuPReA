import server.utils.openaiUtils as utils
import json
import server.modules.module.module as modules

actors_with_description_json = '''
    "risks": [
        {
            "risk": "string",
            "description": "string"
        }
    ]
'''
query_for_who = "Wskaż 10 technologicznych ryzyk systemu z krótkim opisem dla"
query_doing_what = "tworzacego aplikacje do"
query_expectations = "Skup się na celu startupu. Wynik przedstaw w postaci tablicy json zgodnie ze schematem " + actors_with_description_json + ", wartości pól uzupełnij w języku polskim."

class RiskModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, "json", 4000)
        return response

    def get_content(self, forWho, doingWhat, isMock, **kwargs):
        text_response_for_risk = self.make_ai_call(query_for_who + " " + forWho + " " + query_doing_what + " " + doingWhat + " " + query_expectations, {"type": "json_object"});
        return text_response_for_risk
