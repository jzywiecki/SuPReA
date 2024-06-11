
import json
import os
import server.modules.module.module as modules
import server.utils.openaiUtils as utils
import logging
from .util import json_to_mermaid
from .util import save_schema
from. fetch import fetch_database_schema

logger = logging.getLogger("database_schema")
dirname =  os.path.dirname(__file__)

async def generate_database_schema(make_ai_call,chromedriverpath, is_mock=True):
    try:
        database_schema_json = await fetch_database_schema(make_ai_call,  is_mock)
        #TODO: validate
        fomrated = json.dumps(database_schema_json, indent=4)
        fomrated = json_to_mermaid(database_schema_json)
        save_schema(fomrated, chromedriverpath)
        return database_schema_json
    
    except Exception as e:
        logger.error(f"Error generating database_schema: {e}")
        raise Exception(f"Error generating database_schema: {e}")

class DatabaseSchemaModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, msg_type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, msg_type, 4000)
        return response.choices[0].message.content

    async def get_content(self, forWho, doingWhat, **kwargs):
        is_mock = True if kwargs.get('is_mock') else False
        chromedriverpath = kwargs.get('driver')
        return await generate_database_schema(self.make_ai_call,chromedriverpath, is_mock=is_mock)
