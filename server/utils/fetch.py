"""
This module provides functions to fetch resources from the network.
"""

import re
import ray
import requests
from io import BytesIO
from reportlab.platypus import Image
from PIL import Image as PILImage
from utils import logger


def fetch_image(url: str, width, height) -> Image | None:
    """
    Fetches an image from the specified URL.

    :param url: The URL of the image to fetch.
    :param width: The width of the image.
    :param height: The height of the image.
    :return: An Image object if the fetch is successful, otherwise None.
    :rtype: reportlab.platypus.Image
    """
    response = requests.get(url)

    if response.status_code == 200:
        image_stream = BytesIO(response.content)
        image = Image(image_stream, width=width, height=height)
        return image
    return None


def fetch_image_bytes(url: str, width: int, height: int) -> bytes | None:
    response = requests.get(url)

    if response.status_code == 200:
        image = PILImage.open(BytesIO(response.content))

        resized_image = image.resize((width, height))

        output = BytesIO()
        resized_image.save(output, format="PNG")
        return output.getvalue()

    return None


@ray.remote
def fetch_image_task(url: str, width, height) -> Image | None:
    """
    Fetches an image from the specified URL asynchronously using Ray.

    :param url: The URL of the image to fetch.
    :return: An Image object if the fetch is successful, otherwise None.
    :rtype: reportlab.platypus.Image
    """
    try:
        return fetch_image(url, width, height)
    except Exception as e:
        logger.error(f"{e}")
        return None


@ray.remote
def fetch_image_bytes_task(url: str, width, height) -> bytes | None:
    """
    Fetches an bytes from the specified URL and returns its binary data asynchronously using Ray.

    :param url: The URL of the image to fetch.
    :return: Binary data of the image if the fetch is successful, otherwise None.
    """
    try:
        return fetch_image_bytes(url, width, height)
    except Exception as e:
        logger.error(f"{e}")
        return None


def is_valid_url(url: str) -> bool:
    """
    Checks if the provided URL is valid.
    """
    pattern = re.compile(
      r'^(?:http|ftp)s?://'  # http:// or https://
      r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'  # domain...
      r'localhost|'  # localhost...
      r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
      r'(?::\d+)?'  # optional port
      r'(?:/?|[/?]\S+)$', re.IGNORECASE)

    return re.match(pattern, url) is not None
