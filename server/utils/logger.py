import logging
from logging.handlers import RotatingFileHandler

# def configure_logging():
#     logging.basicConfig(filename='messeages2.log', filemode='w', level=logging.INFO,
#                         format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
#                         encoding='utf-8')
def configure_logging():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    log_file = 'messages.log'
    max_bytes = 1024 * 1024  
    backup_count = 1  
    file_handler = RotatingFileHandler(log_file, mode='w', maxBytes=max_bytes, backupCount=backup_count, encoding='utf-8')
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)