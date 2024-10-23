"""
Methods for calling web hooks notifications in the realtime-server.

This module provides methods to send HTTP POST requests to the
realtime-server for different events, such as generation complete,
regeneration complete, and updates.
"""

import requests
import os
import threading

URL = os.environ["REALTIME_SERVER_URL"]

headers = {"Content-Type": "application/json"}


def notify_generation_complete(component, callback: str):
    data = {"component": component, "callback": callback}
    url = URL + "/event/generation-complete"

    def send_request():
        requests.post(url, json=data, headers=headers)

    thread = threading.Thread(target=send_request)
    thread.start()


def notify_regeneration_complete(component, value, callback: str):
    data = {"component": component, "value": value, "callback": callback}
    url = URL + "/event/regeneration-complete"

    def send_request():
        requests.post(url, json=data, headers=headers)

    thread = threading.Thread(target=send_request)
    thread.start()


def notify_update_complete(component, value, callback: str):
    data = {"component": component, "value": value, "callback": callback}
    url = URL + "/event/update-complete"

    def send_request():
        requests.post(url, json=data, headers=headers)

    thread = threading.Thread(target=send_request)
    thread.start()


def send_question_answer(content, callback: str):
    data = {"content": content, "callback": callback}
    url = URL + "/event/message"

    def send_request():
        requests.post(url, json=data, headers=headers)

    thread = threading.Thread(target=send_request)
    thread.start()
