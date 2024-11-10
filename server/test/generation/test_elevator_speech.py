import unittest
import json
from models import ElevatorSpeech
from generation.model.elevator_speech import ElevatorSpeechGenerate

from .base import BaseTestFetchValueFromDatabase
from .base import BaseTestUpdate
from .base import BaseTestGenerateByAI
from .base import BaseTestUpdateByAI


# Test data ===================================================
correct_data = {"content": "example"}

invalid_data = {"elevator_speech": "example"}

invalid_format = "example"

elevator_speech_one = ElevatorSpeech(content="example")

elevator_speech_two = ElevatorSpeech(content="example two")
# ============================================================


class TestFetchElevatorSpeechFromDatabase(
    BaseTestFetchValueFromDatabase, unittest.TestCase
):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = ElevatorSpeechGenerate
        self.correct_data_from_db = correct_data
        self.invalid_data_from_db = invalid_data
        self.expected_value = elevator_speech_one


class TestUpdateElevatorSpeech(BaseTestUpdate, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = ElevatorSpeechGenerate
        self.expected_value = elevator_speech_one


class TestGenerateElevatorSpeechByAI(BaseTestGenerateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = ElevatorSpeechGenerate
        self.correct_generated_data = json.dumps(correct_data)
        self.expected_value = elevator_speech_one
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


class TestUpdateElevatorSpeechByAI(BaseTestUpdateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = ElevatorSpeechGenerate
        self.prev_expected_value = elevator_speech_two
        self.expected_value = elevator_speech_one
        self.correct_generated_data = json.dumps(correct_data)
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


if __name__ == "__main__":
    unittest.main()
