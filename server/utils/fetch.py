import ray
import requests
from io import BytesIO
from reportlab.platypus import Image


def fetch_image(url):
    response = requests.get(url)

    if response.status_code == 200:
        image_stream = BytesIO(response.content)
        image = Image(image_stream, width=200, height=200)
        return image
    return None


@ray.remote
def fetch_image_remote(url):
    try:
        return fetch_image(url)
    except Exception as e:
        # TODO: log error
        return None
