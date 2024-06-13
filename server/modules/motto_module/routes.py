import server.utils.openaiUtils as utils
import json
import server.modules.module.module as modules

motto_schema_json = """
 "motto": "string"
"""
query_for_who = "Make motto for"
query_doing_what = "creating app for"
query_expectations = (
    "Return the result in json format according to the schema:" + motto_schema_json
)


class MottoModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, "json", 4000)
        return response

    def get_content(self, forWho, doingWhat, isMock, **kwargs):
        text_response_for_motto = self.make_ai_call(
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
        return text_response_for_motto
