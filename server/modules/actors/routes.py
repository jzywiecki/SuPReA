import server.utils.openaiUtils as utils
import server.modules.module.module as modules

actors_with_description_json = """
"actors": [
        {
            "name": "string",
            "description": "string"
        }
    ]
"""

query_for_who = "Identify system actors for "
query_doing_what = "creating app for"
query_expectations = (
    "Show them with short description. Focus on the system actors. Return the result in json format according to the schema: "
    + actors_with_description_json
)


class ActorsModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, msg_type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, "json", 4000)
        return response

    def get_content(self, forWho, doingWhat, isMock, **kwargs):
        text_response_for_actors = self.make_ai_call(
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
        return text_response_for_actors
