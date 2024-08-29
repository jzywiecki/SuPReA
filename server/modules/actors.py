import modules.module as modules


actors_json = """
"actors": [
        {
            "name": "string",
            "description": "string"
        }
    ]
"""

for_who_sentence = "Create a few system actors for "

doing_what_sentence = "creating app for "

query_expectations = (
    "Show them with short description. Focus on the system actors. Result return EXACTLY according to provided json schema (do not change the convention from the given json): "
    + actors_json
)


class ActorsModule(modules.Module):
    def __init__(self, model):
        self.model = model

    def create_model_json(
        self, for_who_input, doing_what_input, additional_info_input, is_mock, **kwargs
    ):
        request = self.model.build_create_query(
            for_who_input,
            doing_what_input,
            additional_info_input,
            for_who_sentence,
            doing_what_sentence,
            query_expectations,
        )
        return self.model.generate(request)
