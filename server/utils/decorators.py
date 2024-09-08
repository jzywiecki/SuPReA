"""
This module contains utility decorators for use throughout the application.
"""


def singleton(f):
    """
    Decorator to indicate that a class is a singleton.
    """
    return f


def override(f):
    """
    Decorator to indicate that a method overrides a method in a superclass.
    """
    return f
