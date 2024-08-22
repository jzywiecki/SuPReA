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
query_for_who = "Write few functional and few non-functional requirements for"
query_doing_what = "creating app for"
query_expectations = (
    "Priority should be one of: Must, Should, Could. Result return EXACTLY according to provided json schema (do not change the convention from the given json): "
    + requirements_schema_json
)


class RequirementsModule(modules.Module):
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
