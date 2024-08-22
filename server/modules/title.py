import modules.module as modules


title_json = """
    "names": [
        "generated name1",
        "generated name2",
        "generated name3"
    ]
"""
query_for_who = "Suggest 10 names for "
query_doing_what = " creating app for "
query_expectations = (
        " Result return EXACTLY according to provided JSON schema (do not change the convention from the given json): "
        + title_json
)


class TitleModule(modules.Module):
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
