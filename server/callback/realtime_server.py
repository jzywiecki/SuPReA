"""
Methods for calling web hooks notifications in the realtime-server.

This module provides methods to send HTTP POST requests to the
realtime-server for different events, such as generation complete,
regeneration complete, and updates.
"""

import requests
import os
import ray
from utils.loggers import logger

URL = os.environ["REALTIME_SERVER_URL"]

headers = {"Content-Type": "application/json"}


def notify_generation_complete(component, callback: str):
    data = {"component": component, "callback": callback}
    url = URL + "/event/generation-complete"

    requests.post(url, json=data, headers=headers)


def send_question_answer(content, callback: str):
    data = {"content": content, "callback": callback}
    url = URL + "/event/message"

    requests.post(url, json=data, headers=headers)


@ray.remote
def notify_task(func, *data):
    try:
        func(*data)
    except Exception as e:
        logger.error("Unreachable realtime server.")
        logger.error(f"Error: {e}")
