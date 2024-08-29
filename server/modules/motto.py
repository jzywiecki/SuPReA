import modules.module as modules


motto_schema_json = """
 "motto": "string"
"""

for_who_sentence = "Make motto for"

doing_what_sentence = "creating app for"

query_expectations = (
    "Return the result EXACTLY in json format according to the schema (do not change the convention from the given json):"
    + motto_schema_json
)


class MottoModule(modules.Module):
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
