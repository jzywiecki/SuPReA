import utils.openaiUtils as utils
import json
import modules.module.module as modules

actors_with_description_json = '''
    "strategy": "string"
'''
query_for_who = "Opracuj strategie marketingową dla"
query_doing_what = "tworzacego aplikacje do"
query_expectations = "Wynik zwróć w postaci json zgodnie ze schematem  " + actors_with_description_json + ", wartości pól uzupełnij w języku polskim."

class SpecificationsModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, "json", 4000)
        return response

    async def get_content(self, forWho, doingWhat):
        text_response_for_specifications = self.make_ai_call(query_for_who + " " + forWho + " " + query_doing_what + " " + doingWhat + " " + query_expectations, {"type": "json_object"});
        
        with open('specifications.json', 'w') as file:
            file.write(text_response_for_specifications.choices[0].message.content)

        return text_response_for_specifications
