
import os
import server.modules.module.module as modules
import server.utils.openaiUtils as utils
import logging
from server.utils.data import write_to_file
from .fetch import fetch_business

logger = logging.getLogger("business_scenario")
dirname =  os.path.dirname(__file__)
async def generate_business(make_ai_call, is_mock=True):
    try:
        business_list_json = await fetch_business(make_ai_call,is_mock)
        write_to_file(os.path.join(dirname,'data','gen','scenario.txt'), str(business_list_json))
        return business_list_json
    except Exception as e:
        logger.error(f"Error generating business data: {e}")
        raise Exception(f"Error generating business data: {e}")

class BusinessModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, msg_type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, msg_type, 4000)
        return response.choices[0].message.content

    async def get_content(self, forWho, doingWhat, **kwargs):
        is_mock = True if kwargs.get('is_mock') else False
        return await generate_business(self.make_ai_call, is_mock=is_mock)
