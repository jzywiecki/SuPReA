import modules.module as modules


motto_schema_json = """
 "motto": "string"
"""
query_for_who = "Make motto for"
query_doing_what = "creating app for"
query_expectations = (
    "Return the result EXACTLY in json format according to the schema (do not change the convention from the given json):"
    + motto_schema_json
)


class MottoModule(modules.Module):
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
