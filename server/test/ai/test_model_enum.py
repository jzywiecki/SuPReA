from ai import get_model_remote_ref_enum
from ai import get_image_model_remote_ref_enum
from ai import get_text_model_remote_ref_enum

from ai import gpt_35_turbo_remote_ref
from ai import gpt_4o_mini_remote_ref
from ai import dall_e_3_remote_ref
from ai import dall_e_2_remote_ref

from utils import AIModelNotFound

import unittest


class TestGetModelRemoteRefEnum(unittest.TestCase):
    def test_correct_ai_model_name_should_return_remote_ref_to_ai_model(self):
        correct_name_1 = "gpt-35-turbo"
        correct_name_2 = "gpt-4o-mini"
        correct_name_3 = "dall-e-3"
        correct_name_4 = "dall-e-2"

        self.assertEqual(
            get_model_remote_ref_enum(correct_name_1), gpt_35_turbo_remote_ref
        )
        self.assertEqual(
            get_model_remote_ref_enum(correct_name_2), gpt_4o_mini_remote_ref
        )
        self.assertEqual(get_model_remote_ref_enum(correct_name_3), dall_e_3_remote_ref)
        self.assertEqual(get_model_remote_ref_enum(correct_name_4), dall_e_2_remote_ref)

    def test_incorrect_ai_model_name_should_raise_ai_model_not_found_exception(self):
        incorrect_name = "name of incorrect model"
        with self.assertRaises(AIModelNotFound):
            get_model_remote_ref_enum(incorrect_name)


class TestGetImageModelRemoteRefEnum(unittest.TestCase):
    def test_correct_ai_model_name_should_return_remote_ref_to_ai_model(self):
        correct_name_1 = "dall-e-3"
        correct_name_2 = "dall-e-2"

        self.assertEqual(
            get_image_model_remote_ref_enum(correct_name_1), dall_e_3_remote_ref
        )
        self.assertEqual(
            get_image_model_remote_ref_enum(correct_name_2), dall_e_2_remote_ref
        )

    def test_incorrect_ai_model_name_should_raise_ai_model_not_found_exception(self):
        incorrect_name = "name of incorrect model"
        with self.assertRaises(AIModelNotFound):
            get_image_model_remote_ref_enum(incorrect_name)


class TestGetTextModelRemoteRefEnum(unittest.TestCase):
    def test_correct_ai_model_name_should_return_remote_ref_to_ai_model(self):
        correct_name_1 = "gpt-35-turbo"
        correct_name_2 = "gpt-4o-mini"

        self.assertEqual(
            get_text_model_remote_ref_enum(correct_name_1), gpt_35_turbo_remote_ref
        )
        self.assertEqual(
            get_text_model_remote_ref_enum(correct_name_2), gpt_4o_mini_remote_ref
        )

    def test_incorrect_ai_model_name_should_raise_ai_model_not_found_exception(self):
        incorrect_name = "name of incorrect model"
        with self.assertRaises(AIModelNotFound):
            get_text_model_remote_ref_enum(incorrect_name)


if __name__ == "__main__":
    unittest.main()
