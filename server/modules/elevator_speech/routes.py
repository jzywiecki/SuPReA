
import json
import os
import modules.module.module as modules
import utils.openaiUtils as utils
import logging
from utils.data import write_to_file
from utils.validation import validate_json


logger = logging.getLogger("elevator_speech")
dirname =  os.path.dirname(__file__)

prompt = "A project elevator speech for an application to walking dogs."
details = "results should be a json in format: {content: ''}"
required_schema =  {
    "type": "object",
    "properties": {
        "content": {"type": "string"}
    },
    "required": ["content"]
}
async def generate_speech(make_ai_call, is_mock=True):
    try:
        elevator_speech_json = json.load(open( os.path.join(dirname,'data','test','elevatorSpeech.json'),encoding='utf8')) if is_mock else json.loads(make_ai_call(prompt + " details: " + details,"json"))
        data =  None if not validate_json(elevator_speech_json,required_schema ) else elevator_speech_json        
        write_to_file(os.path.join(dirname,'data','gen','elevatorSpeech.txt'), str(data))
        return data
    except Exception as e:
        logger.error(f"Error generating elevator speech: {e}")
        raise Exception(f"Error generating elevator speech: {e}")

class ElevatorSpeechModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, msg_type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, msg_type, 4000)
        return response.choices[0].message.content

    async def get_content(self, forWho, doingWhat, **kwargs):
        is_mock = True if kwargs.get('is_mock') else False
        return await generate_speech(self.make_ai_call, is_mock=is_mock)
