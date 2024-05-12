import logging
from .fetch import fetch_uml_fragments, fetch_uml_list, fetch_business
from .util import convert_to_uml_imageFile

logger = logging.getLogger("umlModule")

async def generate_uml_list(is_mock=True):
    try:
        return await fetch_uml_list(is_mock)
    except Exception as e:
        logger.error(f"Error generating UML list: {e}")
        raise Exception(f"Error generating UML list: {e}")

async def generate_uml_images(is_mock=True):
    try:
        uml_list = await fetch_uml_list(is_mock)
        uml_fragments = await fetch_uml_fragments(is_mock, uml_list)
        for actor, fragment in uml_fragments:
            convert_to_uml_imageFile(f"{actor}.uml", f"{actor}.png", fragment)
    except Exception as e:
        logger.error(f"Error generating UML images: {e}")
        raise Exception(f"Error generating UML images: {e}")

async def generate_business(is_mock=True):
    try:
        business_list_json = await fetch_business(is_mock)
        return business_list_json
    except Exception as e:
        logger.error(f"Error generating business data: {e}")
        raise Exception(f"Error generating business data: {e}")
