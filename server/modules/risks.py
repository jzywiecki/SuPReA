import modules.module as modules


actors_with_description_json = """
    "risks": [
        {
            "risk": "string",
            "description": "string",
            "prevention": "string"
        }
    ]
"""

for_who_sentence = "Suggest few technological risks of system with short description and way to prevent them for"

doing_what_sentence = "creating app for"

query_expectations = (
    "Result return EXACTLY according to provided json schema (do not change the convention from the given json): "
    + actors_with_description_json
)


class RiskModule(modules.Module):
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
