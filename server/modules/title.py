import modules.module as modules


title_json = """
    "names": [
        "generated name1",
        "generated name2",
        "generated name3"
    ]
"""

for_who_sentence = "Suggest 10 names for "

doing_what_sentence = " creating app for "

query_expectations = (
    " Result return EXACTLY according to provided JSON schema (do not change the convention from the given json): "
    + title_json
)


class TitleModule(modules.Module):
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
