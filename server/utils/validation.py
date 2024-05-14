import logging
from jsonschema import validate, ValidationError
logger = logging.getLogger("validation")
def validate_json(data, schema):
    try:
        validate(instance=data, schema=schema)
        logger.info("JSON validation passed")
        return True
    except ValidationError as e:
        logger.error(f"JSON validation failed: {e}")
        return False
        
