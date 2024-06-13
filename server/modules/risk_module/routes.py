import server.utils.openaiUtils as utils
import json
import server.modules.module.module as modules

actors_with_description_json = """
    "risks": [
        {
            "risk": "string",
            "description": "string",
            "prevention": "string"
        }
    ]
"""
query_for_who = "Suggest 10 technological risks of system with short description and way to prevent them for"
query_doing_what = "creating app for"
query_expectations = (
    "Focus on product goal. Results return in json schema: "
    + actors_with_description_json
)


class RiskModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, "json", 4000)
        return response

    def get_content(self, forWho, doingWhat, isMock, **kwargs):
        text_response_for_risk = self.make_ai_call(
            query_for_who
            + " "
            + forWho
            + " "
            + query_doing_what
            + " "
            + doingWhat
            + " "
            + query_expectations,
            {"type": "json_object"},
        )
        return text_response_for_risk
