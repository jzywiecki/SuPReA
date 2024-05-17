
import json
import os
import modules.module.module as modules
import utils.openaiUtils as utils
import logging
from utils.data import write_to_file
from utils.validation import validate_json


logger = logging.getLogger("title")
dirname =  os.path.dirname(__file__)

prompt = "A project name for an application to walking dogs."
details = "results should be a json list in format: {names: []}"

required_schema =  {
    "type": "object",
    "properties": {
        "names": {
            "type": "array",
            "items": {"type": "string"}
        }
    },
    "required": ["names"]
}
async def generate_title(make_ai_call, is_mock=True):
    try:
        title_json = json.load(open( os.path.join(dirname,'data','test','title.json'),encoding='utf8')) if is_mock else json.loads(make_ai_call(prompt + " details: " + details,"json"))
        data =  None if not validate_json(title_json,required_schema ) else title_json        
        write_to_file(os.path.join(dirname,'data','gen','title.txt'), str(data))
        return data
    except Exception as e:
        logger.error(f"Error generating title: {e}")
        raise Exception(f"Error generating title: {e}")

class TitleModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, msg_type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, msg_type, 4000)
        return response.choices[0].message.content

    async def get_content(self, forWho, doingWhat, **kwargs):
        is_mock = True if kwargs.get('is_mock') else False
        return await generate_title(self.make_ai_call, is_mock=is_mock)
