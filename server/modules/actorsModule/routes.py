import utils.openaiUtils as utils
import modules.module.module as modules

actors_with_description_json = '''
"actors": [
        {
            "name": "string",
            "description": "string"
        }
    ]
'''
query_for_who = "zidentyfikuj aktorów systemu dla"
query_doing_what = "tworzacego aplikacje do"
query_expectations = "Przedstaw ich z krótkim opisem. Wynik zwróć w postaci json zgodnie ze schematem " + actors_with_description_json + ", wartości pól uzupełnij w języku polskim."

class ActorsModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, msg_type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, "json", 4000)
        return response

    async def get_content(self, forWho, doingWhat, **kwargs):
        text_response_for_actors = self.make_ai_call(query_for_who + " " + forWho + " " + query_doing_what + " " + doingWhat + " " + query_expectations, {"type": "json_object"});
        
        with open('actors.json', 'w') as file:
            file.write(text_response_for_actors.choices[0].message.content)

        return text_response_for_actors
