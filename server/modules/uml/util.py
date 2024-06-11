import logging
import re
import plantuml 
from server.utils.data import write_to_file
umlGenerator = plantuml.PlantUML(url='http://www.plantuml.com/plantuml/img/', basic_auth={}, form_auth={}, http_opts={}, request_opts={})
logger = logging.getLogger("umlModule")

def convert_to_uml_imageFile(uml_filename, png_filename, data):
    try:
        write_to_file(uml_filename, data)
        logger.info('PlantUML code has been written to file.')
            
        try:
            umlGenerator.processes_file(uml_filename, outfile=png_filename) #this also can be done without writing and reading from file
        except Exception as e:
            logger.info(f'Got exception from PlanUMl server: {e}')
        logger.info('PNG image has been generated successfully.')
    except Exception as e:
        logger.error(f'Error occurred while converting to UML image: {e}')
        raise Exception(f'Error occurred while converting to UML image: {e}')


def extract_uml_from_messeage(message):
    regex = r'@startuml([\s\S]*?)@enduml'
    match = re.search(regex, message)
    if match:
        return match.group(0)
    else:
        logger.error('UML fragment not found in the message.')



