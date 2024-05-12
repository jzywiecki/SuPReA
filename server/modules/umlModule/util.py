import logging
import re
import plantuml 

umlGenerator = plantuml.PlantUML(url='http://www.plantuml.com/plantuml/img/', basic_auth={}, form_auth={}, http_opts={}, request_opts={})
logger = logging.getLogger("umlModule")

def convert_to_uml_imageFile(uml_filename, png_filename, data):
    try:
        with open(uml_filename, 'w') as f:
            f.write(data)
            logging.info('PlantUML code has been written to file.')
            
        try:
            umlGenerator.processes_file(uml_filename, outfile=png_filename) #this also can be done without writing and reading from file
        except Exception as e:
            logging.info(f'Got exception from PlanUMl server: {e}')
        logging.info('PNG image has been generated successfully.')
    except Exception as e:
        logging.error(f'Error occurred while converting to UML image: {e}')
        raise Exception(f'Error occurred while converting to UML image: {e}')


def extract_uml_from_messeage(message):
    regex = r'@startuml([\s\S]*?)@enduml'
    match = re.search(regex, message)
    if match:
        return match.group(0)
    else:
        logging.error('UML fragment not found in the message.')

def read_from_file(file):
    try:
        with open(file, 'r') as f:
            return f.read()
    except FileNotFoundError as e:
        logging.error(f'File not found: {file}')
        raise Exception(f'File not found: {file} {e}')

