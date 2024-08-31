import modules.module as modules


use_case_json = """

"""

for_who_sentence = " "

doing_what_sentence = " creating app for "

query_expectations = "  " + use_case_json


class UseCaseModule(modules.Module):
    def __init__(self, model):
        self.model = model

    def __create_model_json(self, for_who, doing_what, additional_info, **kwargs):
        request = self.model.build_create_query(
            for_who,
            doing_what,
            additional_info,
            for_who_sentence,
            doing_what_sentence,
            query_expectations,
        )
        return self.model.generate_by_ai(request)
