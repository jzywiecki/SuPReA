import modules.module as modules


specifications_schema_json = """
    "specifications": [
        {
            "name": "string",
            "description": "string"
        }
    ]
"""

for_who_sentence = "Write specifications for "

doing_what_sentence = " creating app for "

query_expectations = (
    " Result return EXACTLY according to provided json schema (do not change the convention from the given json): "
    + specifications_schema_json
)


class SpecificationsModule(modules.Module):
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
