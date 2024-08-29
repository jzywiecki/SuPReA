import modules.module as modules


marketing_strategy_schema_json = """
{
    "strategy": "string"
}
"""

for_who_sentence = "Design marketing strategy for"

doing_what_sentence = "creating app for"

query_expectations = (
    " Result return EXACTLY according to provided json schema (do not change the convention from the given json): "
    + marketing_strategy_schema_json
)


class StrategyModule(modules.Module):
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
