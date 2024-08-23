import modules.module as modules


marketing_strategy_schema_json = """
{
    "strategy": "string"
}
"""
query_for_who = "Design marketing strategy for"
query_doing_what = "creating app for"
query_expectations = (
    " Result return EXACTLY according to provided json schema (do not change the convention from the given json): "
    + marketing_strategy_schema_json
)


class StrategyModule(modules.Module):
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
