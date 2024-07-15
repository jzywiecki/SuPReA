import json
import logging
import os
import uuid
from .fetch import fetch_uml_fragments, fetch_uml_list
from .util import convert_to_uml_imageFile
import modules.module.module as modules
import utils.openaiUtils as utils

dirname = os.path.dirname(__file__)
logger = logging.getLogger("umlModule")


def generate_uml_list(ai_call_func, is_mock=False):
    try:
        return fetch_uml_list(ai_call_func, is_mock)
    except Exception as e:
        logger.error(f"Error generating UML list: {e}")
        raise Exception(f"Error generating UML list: {e}")


def generate_uml_images(
    ai_call_func, for_who, doing_what, additional_info, is_mock=False
):
    random_uuid = uuid.uuid4()
    # path = os.path.join(dirname, "data", "gen", str(random_uuid))
    # os.mkdir(path)
    # try:
    returned_list = []
    uml_list = fetch_uml_list(
        ai_call_func, for_who, doing_what, additional_info, is_mock
    )
    uml_fragments = fetch_uml_fragments(uml_list, ai_call_func, is_mock)

    for actor, fragment in uml_fragments:
        entry = {"title": actor, "code": fragment}
        returned_list.append(entry)
    obj = {}
    obj["umls"] = returned_list
    return json.dumps(obj, indent=4)

    # except Exception as e:
    #     logger.error(f"Error generating UML images: {e}")
    #     raise Exception(f"Error generating UML images: {e}")


class UmlModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, msg_type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, msg_type, 4000)
        return response.choices[0].message.content

    def get_content(self, for_who, doing_what, additional_info, is_mock, **kwargs):
        if kwargs.get("uml_list") is True:
            return generate_uml_list(self.make_ai_call, is_mock=is_mock)
        else:
            # uml_list = generate_uml_list(self.make_ai_call, is_mock=is_mock)
            uml_code = generate_uml_images(
                self.make_ai_call, for_who, doing_what, additional_info, is_mock=is_mock
            )
        return uml_code
