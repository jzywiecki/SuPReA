import unittest
import json
from pydantic import ValidationError

from models import Logo
from generation.model.logo import LogoGenerate
from ai.open_ai import gpt_35_turbo
from unittest.mock import patch

from .base import BaseTestFetchValueFromDatabase
from .base import BaseTestUpdate


# Test data ===================================================
correct_data = {"logo_urls": ["exampleOne", "exampleTwo"]}

invalid_data = {"logos": ["exampleOne", "exampleTwo"]}

invalid_format = "exampleOne, exampleTwo"

logo_one = Logo(logo_urls=["exampleOne", "exampleTwo"])

logo_two = Logo(logo_urls=["exampleOne", "exampleTwo", "exampleThree"])
# ============================================================


class TestFetchLogosFromDatabase(BaseTestFetchValueFromDatabase, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = LogoGenerate
        self.correct_data_from_db = correct_data
        self.invalid_data_from_db = invalid_data
        self.expected_value = logo_one


class TestUpdateLogos(BaseTestUpdate, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = LogoGenerate
        self.expected_value = logo_one


class TestGenerateLogosByAI(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = LogoGenerate
        self.correct_generated_data = correct_data["logo_urls"]
        self.expected_value = logo_one
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)

    @patch("generation.model.logo.process_ai_requests")
    def test_generate_when_ai_generate_correct_data_should_create_instance_value(
        self, mock_generate
    ):
        mock_generate.return_value = self.correct_generated_data
        generate = self.generate_class()
        result = generate.generate_by_ai(gpt_35_turbo, "example", "example", "example")

        self.assertEqual(self.expected_value, result)
        self.assertEqual(self.expected_value, generate.get_value())

    @patch("generation.model.logo.process_ai_requests")
    def test_generate_when_ai_generate_invalid_data_format_should_raise_validation_exception(
        self, mock_generate
    ):
        mock_generate.return_value = self.invalid_generated_data_format

        with self.assertRaises(ValidationError):
            self.generate_class().generate_by_ai(
                gpt_35_turbo, "example", "example", "example"
            )

    @patch("generation.model.logo.process_ai_requests")
    def test_generate_when_ai_dont_generate_any_data_should_raise_value_error(
        self, mock_generate
    ):
        mock_generate.return_value = None

        with self.assertRaises(ValueError):
            self.generate_class().generate_by_ai(
                gpt_35_turbo, "example", "example", "example"
            )

    @patch("generation.model.logo.process_ai_requests")
    def test_generate_when_ai_generate_wrong_json_should_raise_validation_error(
        self, mock_generate
    ):
        mock_generate.return_value = self.invalid_generated_json

        with self.assertRaises(ValueError):
            self.generate_class().generate_by_ai(
                gpt_35_turbo, "example", "example", "example"
            )


class TestUpdateLogosByAI(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = LogoGenerate
        self.prev_expected_value = logo_two
        self.expected_value = logo_one
        self.correct_generated_data = correct_data["logo_urls"]
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)

    @patch("generation.model.logo.process_ai_requests")
    def test_update_by_ai_when_val_is_none_should_raise_value_error(
        self, mock_generate
    ):
        mock_generate.return_value = self.correct_generated_data

        with self.assertRaises(ValueError):
            self.generate_class().update_by_ai(gpt_35_turbo, "query")

    @patch("generation.model.logo.process_ai_requests")
    def test_update_by_ai_when_ai_generate_correct_data_should_create_instance_value(
        self, mock_generate
    ):
        mock_generate.return_value = self.correct_generated_data
        generate = self.generate_class()
        generate.update(self.prev_expected_value)
        result = generate.update_by_ai(gpt_35_turbo, "query")

        self.assertEqual(self.expected_value, result)
        self.assertEqual(self.expected_value, generate.get_value())

    @patch("generation.model.logo.process_ai_requests")
    def test_update_by_when_ai_generate_invalid_data_format_should_raise_validation_exception(
        self, mock_generate
    ):
        mock_generate.return_value = self.invalid_generated_data_format

        with self.assertRaises(ValidationError):
            generate = self.generate_class()
            generate.update(self.prev_expected_value)
            generate.update_by_ai(gpt_35_turbo, "query")

    @patch("generation.model.logo.process_ai_requests")
    def test_update_by_ai_when_ai_generate_wrong_json_should_raise_validation_error(
        self, mock_generate
    ):
        mock_generate.return_value = self.invalid_generated_json

        with self.assertRaises(ValueError):
            generate = self.generate_class()
            generate.update(self.prev_expected_value)
            generate.update_by_ai(gpt_35_turbo, "query")

    @patch("generation.model.logo.process_ai_requests")
    def test_update_by_ai_when_ai_dont_generate_any_value_should_raise_exception(
        self, mock_generate
    ):
        mock_generate.return_value = None

        with self.assertRaises(Exception):
            generate = self.generate_class()
            generate.update(self.prev_expected_value)
            generate.update_by_ai(gpt_35_turbo, "query")


if __name__ == "__main__":
    unittest.main()
