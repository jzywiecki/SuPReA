import modules.module as modules


elevator_speech_json = """
    "content": "string"
"""
query_for_who = "Make a elevator pitch for "
query_doing_what = " creating app for "
query_expectations = (
    "Result return EXACTLY according to provided json schema (do not change the convention from the given json): "
    + elevator_speech_json
)


class ElevatorSpeechModule(modules.Module):
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
