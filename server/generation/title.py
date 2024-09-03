from .generate import Generate
from models import Title
from models import ComponentIdentify


expected_format = """
    "names": [
        "generated name1",
        "generated name2",
        "generated name3"
    ]
"""


class TitleGenerate(Generate):
    def __init__(self):
        super().__init__(Title, "title", expected_format, ComponentIdentify.TITLE)
