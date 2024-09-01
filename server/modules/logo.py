import ray

import modules.module as modules
from models import Logo
from utils.decorators import override
from ai import ai_call_remote
from models import ProjectFields
from utils import logger_ai


expected_format = """
    The image is a single logo with no additional content! Don't put additional content on picture instead of logo.
"""

additional_details1 = " The logo should be simple and colorful. The whole background should be white."
additional_details2 = " The logo should be simple and not colorful. The whole background should be white."
additional_details3 = " The logo should be for children. The whole background should be white. "
additional_details4 = " The logo should be funny. The whole background should be white. "


@ray.remote
class LogoModule(modules.Module):
    def __init__(self):
        super().__init__(Logo, "logo", expected_format, ProjectFields.LOGO.value)

    @override
    def generate_by_ai(self, ai_model, for_what, doing_what, additional_info):
        """Specify implementation for generating a model using the AI image-model."""
        try:
            request1 = ai_model.parse_generate_query(
                self.what, for_what, doing_what, additional_details1, self.expected_format
            )
            request2 = ai_model.parse_generate_query(
                self.what, for_what, doing_what, additional_details2, self.expected_format
            )
            request3 = ai_model.parse_generate_query(
                self.what, for_what, doing_what, additional_details3, self.expected_format
            )
            request4 = ai_model.parse_generate_query(
                self.what, for_what, doing_what, additional_details4, self.expected_format
            )

            list_value = process_ai_requests(ai_model, request1, request2, request3, request4)
            self.value = make_model_from_reply(self.model_class, list_value)

            logger_ai.info(f"Finished successfully.", extra={"ai_model": ai_model.name(), "component": self.what})

        except Exception as e:
            logger_ai.error(f"{e}", extra={"ai_model": ai_model.name(), "component": self.what})
            raise e

    @override
    def update_by_ai(self, ai_model, changes_request):
        """Update a model using the AI model."""
        try:
            request1 = ai_model.parse_update_query(self.what, "", changes_request, self.expected_format)
            request2 = ai_model.parse_update_query(self.what, "", changes_request, self.expected_format)
            request3 = ai_model.parse_update_query(self.what, "", changes_request, self.expected_format)
            request4 = ai_model.parse_update_query(self.what, "", changes_request, self.expected_format)

            list_value = process_ai_requests(ai_model, request1, request2, request3, request4)
            self.value = make_model_from_reply(self.model_class, list_value)

            logger_ai.info(f"Finished successfully.", extra={"ai_model": ai_model.name(), "component": self.what})

        except Exception as e:
            logger_ai.error(f"{e}", extra={"ai_model": ai_model.name(), "component": self.what})
            raise e


def process_ai_requests(ai_model, *requests):
    replies = []
    for request in requests:
        replies.append(ai_call_remote.remote(ai_model, request))

    results = ray.get(replies)
    return results


def make_model_from_reply(model_class, reply):
    return model_class(logo_urls=reply)