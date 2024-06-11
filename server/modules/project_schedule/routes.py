
import json
import os
import server.modules.module.module as modules
import server.utils.openaiUtils as utils
import logging
from server.utils.data import write_to_file
from server.utils.validation import validate_json

logger = logging.getLogger("schedule")
dirname =  os.path.dirname(__file__)

prompt = "A project schedule for an application to walking dogs."
details = """Let the plan show the development of the application from the programming and business side. results should be a json in format: 
{milestones: [
    {name: '', description: '', duration: ''},
    ]}"""

required_schema =   {
    "type": "object",
    "properties": {
        "milestones": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string", "minLength": 1},
                    "description": {"type": "string", "minLength": 1},
                    "duration": {"type": "string", "minLength": 1}
                },
                "required": ["name", "description", "duration"]
            }
        }
    },
    "required": ["milestones"]
}
async def generate_schedule(make_ai_call, is_mock=True):
    try:
        schedule_json = json.load(open( os.path.join(dirname,'data','test','schedule.json'),encoding='utf8')) if is_mock else json.loads(make_ai_call(prompt + " details: " + details,"json"))
        data =  None if not validate_json(schedule_json,required_schema ) else schedule_json        
        write_to_file(os.path.join(dirname,'data','gen','schedule.txt'), str(data))
        return data
    except Exception as e:
        logger.error(f"Error generating schedule: {e}")
        raise Exception(f"Error generating schedule: {e}")

class ScheduleModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, msg_type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, msg_type, 4000)
        return response.choices[0].message.content

    async def get_content(self, forWho, doingWhat, **kwargs):
        is_mock = True if kwargs.get('is_mock') else False
        return await generate_schedule(self.make_ai_call, is_mock=is_mock)
