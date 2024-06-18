import json
import logging
import os
from .util import extract_uml_from_messeage
from server.utils.validation import validate_json
from server.utils.data import read_from_file

logger = logging.getLogger("umlModule")
dirname = os.path.dirname(__file__)


def fetch_uml_list(ai_call_func, for_who, doing_what, additional_info, is_mock=False):
    required_schema = {
        "type": "object",
        "properties": {
            "actors": {
                "type": "object",
                "patternProperties": {
                    ".*": {
                        "type": "object",
                        "properties": {
                            "diagrams": {"type": "array", "items": {"type": "string"}}
                        },
                        "required": ["diagrams"],
                    }
                },
            }
        },
        "required": ["actors"],
    }
    try:
        schema = """
            {
                "actors": {
                "*someActorName":{
                   "diagrams": [
                            # ........................
                        ]
                    }
                }

            }
        """

        diagram_query = "Generate a list of comprehensive UML use case diagrams for " + for_who + "doing " + doing_what + ". Present the list as JSON with names of diagrams for each actor or actor mix: {schema}. Include all possible use case diagrams." + additional_info

        try:
            diagramsListJson = (
                json.load(
                    open(
                        os.path.join(
                            dirname, "data", "test", "diagramsListResponse.json"
                        ),
                        encoding="utf8",
                    )
                )
                if is_mock
                else json.loads(ai_call_func(diagrams_query, "json"))
            )
            if not validate_json(diagramsListJson, required_schema):
                return None
        except (FileNotFoundError, Exception) as e:
            logger.error(f"Error occurred while fetching UML list: {e}")
            return None
        return diagramsListJson

    except (FileNotFoundError, json.JSONDecodeError, Exception) as e:
        logger.error(f"Error occurred while fetching UML diagrams list: {e}")
        raise Exception(f"Error occurred while fetching UML diagrams list: {e}")


def fetch_uml_fragments(diagramsListJson, ai_call_func, is_mock=False):
    uml_diagrams = []
    if diagramsListJson is not None:
        try:
            for actor, data in diagramsListJson["actors"].items():
                schema = f"Actor: {actor}, Diagrams: {', '.join(data['diagrams'])}"
                uml_query = (
                    f"Generate a detailed and complex PlantUML diagram for {schema}"
                )
                text_response_for_uml_code = (
                    read_from_file(
                        os.path.join(dirname, "data", "test", "umls", f"{actor}.uml")
                    )
                    if is_mock
                    else ai_call_func(uml_query, None)
                )

                fragment_uml = extract_uml_from_messeage(text_response_for_uml_code)
                if fragment_uml:
                    uml_diagrams.append((actor, fragment_uml))

            return uml_diagrams

        except (FileNotFoundError, Exception) as e:
            logger.error(f"Error occurred while fetching UML fragments: {e}")
            raise Exception(f"Error occurred while fetching UML fragments: {e}")
