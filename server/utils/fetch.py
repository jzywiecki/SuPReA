"""
This module provides functions to fetch resources from the network.
"""

import ray
import requests
from io import BytesIO
from reportlab.platypus import Image
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
