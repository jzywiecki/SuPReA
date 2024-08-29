import modules.module as modules


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

for_who_sentence = "Write few functional and few non-functional requirements for"

doing_what_sentence = "creating app for"

query_expectations = (
    "Priority should be one of: Must, Should, Could. Result return EXACTLY according to provided json schema (do not change the convention from the given json): "
    + requirements_schema_json
)


class RequirementsModule(modules.Module):
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
