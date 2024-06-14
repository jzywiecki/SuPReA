import server.utils.openaiUtils as utils
import json
import server.modules.module.module as modules

requirements_schema_json = """
    "functional_requirements": [
        {
            "name": "string",
            "description": "string",
            "priority": "string"
        }
    ], 
    "non_functional_requirements": [
        {
            "name": "string",
            "description": "string",
            "priority": "string"
        }
    ]
"""
query_for_who = "Write 10 functional and 10 non-functional requirements for"
query_doing_what = "creating app for"
query_expectations = (
    "Priority should be one of: Must, Should, Could. Results should be in json format according to the schema: "
    + requirements_schema_json
)


class RequirementsModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, "json", 4000)
        return response

    def get_content(self, for_who, doing_what, is_mock, additional_info, **kwargs):
        text_response_for_requirements = self.make_ai_call(
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
        return text_response_for_requirements
