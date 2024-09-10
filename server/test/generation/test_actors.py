import unittest
import json
from models import Actors, Actor
from generation.actors import ActorsGenerate

from .base import BaseTestFetchValueFromDatabase
from .base import BaseTestUpdate
from .base import BaseTestGenerateByAI
from .base import BaseTestUpdateByAI


# Test data ===================================================
correct_data = {
    "actors": [
        {
            "name": "John Doe",
            "description": "example",
        },
        {
            "name": "Jane Doe",
            "description": "example",
        }
    ]
}

invalid_data = {
    "actor": [
        {
            "name": "John Doe",
            "description": "example",
        }
    ]
}

invalid_format = "actor: - name: John Doe - description: example - name: Jane Doe - description: example"

actor_one = Actor(name="John Doe", description="example")
actor_two = Actor(name="Jane Doe", description="example")
actors_one = Actors(actors=[actor_one, actor_two])

actor_three = Actor(name="Mike", description="example")
actors_two = Actors(actors=[actor_one, actor_two, actor_three])
# ============================================================


class TestFetchActorsFromDatabase(BaseTestFetchValueFromDatabase, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = ActorsGenerate
        self.correct_data_from_db = correct_data
        self.invalid_data_from_db = invalid_data
        self.expected_value = actors_one


class TestUpdateActors(BaseTestUpdate, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = ActorsGenerate
        self.expected_value = actors_one


class TestGenerateActorsByAI(BaseTestGenerateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = ActorsGenerate
        self.correct_generated_data = json.dumps(correct_data)
        self.expected_value = actors_one
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


class TestUpdateActorsByAI(BaseTestUpdateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = ActorsGenerate
        self.prev_expected_value = actors_two
        self.expected_value = actors_one
        self.correct_generated_data = json.dumps(correct_data)
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


if __name__ == "__main__":
    unittest.main()
