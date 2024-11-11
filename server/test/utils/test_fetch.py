import unittest
from utils import is_valid_url


class TestIsValidURL(unittest.TestCase):
    def test_valid_urls(self):
        valid_urls = [
            "https://www.example.com",
            "http://localhost:8000",
            "ftp://example.com/file",
            "https://example.co.uk",
            "https://192.168.1.1",
        ]

        for url in valid_urls:
            with self.subTest(url=url):
                self.assertTrue(is_valid_url(url), f"URL '{url}' should be valid.")

    def test_invalid_urls(self):
        invalid_urls = [
            "htp://example.com",
            "://example.com",
            "http://",
            "www.example.com",
            "ftp://",
            "http://[invalid_ip]"
        ]

        for url in invalid_urls:
            with self.subTest(url=url):
                self.assertFalse(is_valid_url(url), f"URL '{url}' should be invalid")
