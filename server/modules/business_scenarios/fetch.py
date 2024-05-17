
import json
import os
import logging
from utils.validation import validate_json

logger = logging.getLogger("business_scenario")

valid_schema = {
    "type": "object",
    "properties": {
        "business_scenario": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "description": {"type": "string"},
                "features": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "feature_name": {"type": "string"},
                            "description": {"type": "string"}
                        },
                        "required": ["feature_name", "description"]
                    }
                }
            },
            "required": ["title", "description", "features"]
        }
    },
    "required": ["business_scenario"]
}
dirname =  os.path.dirname(__file__)
async def fetch_business(make_ai_call, is_mock=False):
    try:
        schema = '''
            {
                "business_scenario": {
                    "title": "....",
                    "description": "....",
                    "features": [
                        {"feature_name": "...", "description": "..."},
                        {"feature_name": "...", "description": "..."}
                    ]
                }
            }
        '''
        diagrams_query = f"I am planning an IT startup focusing on a dog walking app. Generate business scenarios: {schema}"
        
        diagrams_list_json = json.load(open( os.path.join(dirname,'data','test','scenarios.json'), encoding='utf8')) if is_mock else make_ai_call(diagrams_query, "json")
        if not validate_json(diagrams_list_json, valid_schema ) : return None
        return diagrams_list_json
    
    except (json.JSONDecodeError, Exception) as e:
        logger.error(f"Error occurred while fetching business scenarios: {e}")
        raise Exception(f"Error occurred while fetching business scenarios: {e}")