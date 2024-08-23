import modules.module as modules


business_json = """
    "business_scenario": {
        "title": "string",
        "description": "string",
        "features": [
            {"feature_name": "string", "description": "string"},
        ]
    }
"""
query_for_who = "Suggest a business scenario for "
query_doing_what = "creating app for"
query_expectations = (
    "Show it with short description and features. Result return EXACTLY according to provided json schema (do not change the convention from the given json): "
    + business_json
)


class BusinessScenariosModule(modules.Module):
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
