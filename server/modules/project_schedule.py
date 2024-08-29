import modules.module as modules


harmonogram_json = """
    "milestones": [
        {
            "name": "string",
            "description": "string",
            "duration": "string"
        }
    ]
"""

for_who_sentence = "Suggest a work schedule for "

doing_what_sentence = " creating app for "

query_expectations = (
    "Show it with milestones. Focus on business site of a schedule. Result return EXACTLY according to provided json schema (do not change the convention from the given json): "
    + harmonogram_json
)


class ScheduleModule(modules.Module):
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
