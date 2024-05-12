import json
import logging
from .util import read_from_file, extract_uml_from_messeage
from utils.ai_f3th import make_ai_call

logger = logging.getLogger("umlModule")

async def fetch_uml_list(is_mock=False):
    try:
        schema = '''
            {
                "actors": {
                    "diagrams": [
                        # ........................
                    ]
                }
            }
        '''
        diagrams_query = f"""
            Generate a list of comprehensive UML use case diagrams for a startup creating a dog walking application, 
            considering all actors in the system. 
            Present the list as JSON with names of diagrams for each actor or actor mix: {schema}. 
            Include all possible use case diagrams.
        """
        if is_mock:
            textResponseForUMLDiagramsList = json.load(open('/data/test/diagramsListResponse.json'))
        else:
            textResponseForUMLDiagramsList = await make_ai_call(diagrams_query, { "type": "json_object" })
        
        diagramsListJson = json.loads(textResponseForUMLDiagramsList)
        return diagramsListJson
    
    except (FileNotFoundError, json.JSONDecodeError, Exception) as e:
        logger.error(f"Error occurred while fetching UML diagrams list: {e}")
        raise Exception(f"Error occurred while fetching UML diagrams list: {e}")


async def fetch_uml_fragments(diagramsListJson, is_mock=False):
    uml_diagrams = []
    try:
        for actor, data in diagramsListJson['actors'].items():
            schema = f"Actor: {actor}, Diagrams: {', '.join(data['diagrams'])}"
            uml_query = f"Generate a detailed and complex PlantUML diagram for {schema}"
            if is_mock:
                text_response_for_uml_code = read_from_file(f"/data/test/umls/{actor}.uml")
            else:
                text_response_for_uml_code = await make_ai_call(uml_query, None)
            
            fragment_uml = extract_uml_from_messeage(text_response_for_uml_code)
            if fragment_uml:
                uml_diagrams.append((actor, fragment_uml))
        
        return uml_diagrams
    
    except (FileNotFoundError, Exception) as e:
        logger.error(f"Error occurred while fetching UML fragments: {e}")
        raise Exception(f"Error occurred while fetching UML fragments: {e}")


async def fetch_business(is_mock=False):
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
        
        if is_mock:
            text_response_for_uml_diagrams_list = '{}'
        else:
            text_response_for_uml_diagrams_list = await make_ai_call(diagrams_query, {"type": "json_object"})
        
        diagrams_list_json = json.loads(text_response_for_uml_diagrams_list)
        return diagrams_list_json
    
    except (json.JSONDecodeError, Exception) as e:
        logger.error(f"Error occurred while fetching business scenarios: {e}")
        raise Exception(f"Error occurred while fetching business scenarios: {e}")
