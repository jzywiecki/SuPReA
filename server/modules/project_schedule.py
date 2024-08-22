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
query_for_who = "Suggest a work schedule for "
query_doing_what = " creating app for "
query_expectations = (
    "Show it with milestones. Focus on business site of a schedule. Result return EXACTLY according to provided json schema (do not change the convention from the given json): "
    + harmonogram_json
)


class ScheduleModule(modules.Module):
    def __init__(self, model):
        self.model = model

    def get_content(self, for_who, doing_what, additional_info, is_mock, **kwargs):
        request = (
            query_for_who
            + " "
            + for_who
            + " "
            + query_doing_what
            + " "
            + doing_what
            + " "
            + query_expectations
            + " "
            + additional_info
        )
        return self.model.generate(request)
