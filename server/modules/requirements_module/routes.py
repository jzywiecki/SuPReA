import server.utils.openaiUtils as utils
import json
import server.modules.module.module as modules

requirements_schema_json = '''
    "functional_requirements": [
        {
            "name": "string",
            "description": "string"
        }
    ], 
    "non_functional_requirements": [
        {
            "name": "string",
            "description": "string"
        }
    ]
'''
query_for_who = "Wypisz po 10 wymagań funkcjonalnych i niefunkcjonalnych dla"
query_doing_what = "tworzacego aplikacje do"
query_expectations = "Wynik przedstaw w postaci tablicy json zgodnie ze schematem " + requirements_schema_json + ", wartości pól uzupełnij w języku polskim."

class RequirementsModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, "json", 4000)
        return response

    async def get_content(self, forWho, doingWhat):
        text_response_for_requirements = self.make_ai_call(query_for_who + " " + forWho + " " + query_doing_what + " " + doingWhat + " " + query_expectations, {"type": "json_object"});
        
        with open('requirements.json', 'w') as file:
            file.write(text_response_for_requirements.choices[0].message.content)

        return text_response_for_requirements
