from .generate import Generate
from models import Motto
from models import ComponentIdentify


expected_format = """
 "motto": "string"
"""


class MottoGenerate(Generate):
    def __init__(self):
        super().__init__(Motto, "motto", expected_format, ComponentIdentify.MOTTO)
