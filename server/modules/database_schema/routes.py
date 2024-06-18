import json
import os
import server.modules.module.module as modules
import server.utils.openaiUtils as utils
import logging
from .util import json_to_mermaid
from .util import save_schema
from .fetch import fetch_database_schema

logger = logging.getLogger("database_schema")
dirname = os.path.dirname(__file__)


def generate_database_schema(make_ai_call, doing_what=None, for_who=None, additional_info=None, is_mock=False):
    # try:
    database_schema_json = fetch_database_schema(for_who, doing_what, additional_info, make_ai_call, is_mock)
    # formatted = json.dumps(database_schema_json, indent=4)
    # formatted = json_to_mermaid(database_schema_json)
    return database_schema_json

    # except Exception as e:
    #     raise Exception(f"Error generating database_schema: {e}")


class DatabaseSchemaModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, msg_type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, msg_type, 4000)
        return response.choices[0].message.content

    def get_content(self, for_who, doing_what, additional_info, is_mock, **kwargs):
        database_schema = generate_database_schema(self.make_ai_call, for_who, doing_what, additional_info, is_mock=is_mock)
        return database_schema
