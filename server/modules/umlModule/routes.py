import logging
import os
import uuid
from .fetch import fetch_uml_fragments, fetch_uml_list
from .util import convert_to_uml_imageFile
import modules.module.module as modules
import utils.openaiUtils as utils

dirname =  os.path.dirname(__file__)
logger = logging.getLogger("umlModule")

async def generate_uml_list(ai_call_func,is_mock=False):
    try:
        return await fetch_uml_list(ai_call_func,is_mock)
    except Exception as e:
        logger.error(f"Error generating UML list: {e}")
        raise Exception(f"Error generating UML list: {e}")

async def generate_uml_images(ai_call_func,is_mock=False):
    random_uuid = uuid.uuid4()
    path = os.path.join(dirname,'data','gen',str(random_uuid))
    os.mkdir(path)
    try:
        uml_list = await fetch_uml_list(ai_call_func,is_mock)
        uml_fragments = await fetch_uml_fragments(uml_list,ai_call_func,is_mock )
        for actor, fragment in uml_fragments:
            convert_to_uml_imageFile(os.path.join(path,f"{actor}.uml"), os.path.join(path,f"{actor}.png"), fragment)
    except Exception as e:
        logger.error(f"Error generating UML images: {e}")
        raise Exception(f"Error generating UML images: {e}")
    
class UmlModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, msg_type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, msg_type, 4000)
        return response.choices[0].message.content

    async def get_content(self, forWho, doingWhat, **kwargs):
        is_mock = True if kwargs.get('is_mock') else False
        if kwargs.get('uml_list') is True:
            return await generate_uml_list(self.make_ai_call, is_mock=is_mock)
        else:
            uml_list = await generate_uml_list(self.make_ai_call, is_mock=is_mock)
            await generate_uml_images(self.make_ai_call, is_mock=is_mock)
        return uml_list

# async def generate_business(is_mock=True):
#     try:
#         business_list_json = await fetch_business(is_mock)
#         return business_list_json
#     except Exception as e:
#         logger.error(f"Error generating business data: {e}")
#         raise Exception(f"Error generating business data: {e}")
