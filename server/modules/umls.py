import json
import logging
import modules.module as modules
import re

logger = logging.getLogger("umlModule")


def extract_uml_from_message(message):
    regex = r"@startuml([\s\S]*?)@enduml"
    match = re.search(regex, message)
    if match:
        return match.group(0)
    else:
        logger.error("UML fragment not found in the message.")


def fetch_uml_list(ai_call_func, for_who, doing_what, additional_info):
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

    diagram_query = (
        "Generate a list of comprehensive UML use case diagrams for "
        + for_who
        + "doing "
        + doing_what
        + f". Present the list as JSON with names of diagrams for each actor or actor mix: {schema}. Include all possible use case diagrams."
        + additional_info
    )

    try:
        diagramsListJson = json.loads(ai_call_func(diagram_query))
    except Exception as e:
        logger.error(f"Error occurred while fetching UML list: {e}")
        return None
    return diagramsListJson


def fetch_uml_fragments(diagrams_list_json, ai_call_func):
    uml_diagrams = []
    if diagrams_list_json is not None:
        try:
            for actor, data in diagrams_list_json["actors"].items():
                schema = f"Actor: {actor}, Diagrams: {', '.join(data['diagrams'])}"
                uml_query = (
                    f"Generate a detailed and complex PlantUML diagram for {schema}"
                )

                text_response_for_uml_code = ai_call_func(uml_query)

                fragment_uml = extract_uml_from_message(text_response_for_uml_code)
                if fragment_uml:
                    uml_diagrams.append((actor, fragment_uml))

            return uml_diagrams

        except Exception as e:
            logger.error(f"Error occurred while fetching UML fragments: {e}")
            raise Exception(f"Error occurred while fetching UML fragments: {e}")


def generate_uml_images(ai_call_func, for_who, doing_what, additional_info):
    returned_list = []
    uml_list = fetch_uml_list(ai_call_func, for_who, doing_what, additional_info)
    uml_fragments = fetch_uml_fragments(uml_list, ai_call_func)

    for actor, fragment in uml_fragments:
        entry = {"title": actor, "code": fragment}
        returned_list.append(entry)
    obj = {"umls": returned_list}
    return json.dumps(obj, indent=4)


class UmlModule(modules.Module):
    def __init__(self, model):
        self.model = model

    def get_content(self, for_who, doing_what, additional_info, is_mock, **kwargs):
        return generate_uml_images(
            self.model.generate, for_who, doing_what, additional_info
        )
