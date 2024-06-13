import logging

def read_from_file(file):
    try:
        with open(file, 'r') as f:
            return f.read()
    except FileNotFoundError as e:
        logging.error(f'File not found: {file}')
        raise Exception(f'File not found: {file} {e}')
    
def write_to_file(file, content):
    try:
        with open(file, 'w', encoding='utf8') as f:
            f.write(content)
    except Exception as e:
        logging.error(f'Error writing to file: {file}')
        raise Exception(f'Error writing to file: {file} {e}')