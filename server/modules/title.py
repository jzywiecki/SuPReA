import ray

import modules.module as modules
from models import Title
from models import ProjectFields


expected_format = """
    "names": [
        "generated name1",
        "generated name2",
        "generated name3"
    ]
"""


@ray.remote
class TitleModule(modules.Module):
    def __init__(self):
        super().__init__(Title, "title", expected_format, ProjectFields.TITLE)
