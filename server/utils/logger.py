import logging

def configure_logging():
    logging.basicConfig(filename='messeages.log', level=logging.INFO,
                        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
