import server.utils.openaiUtils as utils
import json
import server.modules.module.module as modules

marketing_strategy_schema_json = """
    "strategy": "string"
"""

query_for_who = "Design marketing strategy for"
query_doing_what = "creating app for"
query_expectations = (
    "Result return according to provided json schema: " + marketing_strategy_schema_json
)


class StrategyModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, "json", 4000)
        return response

    def get_content(self, forWho, doingWhat, isMock, **kwargs):
        text_response_for_specifications = self.make_ai_call(
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
        return text_response_for_specifications
