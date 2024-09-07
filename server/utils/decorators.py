"""
This module contains utility decorators for use throughout the application.
"""


def singleton(class_):
    """
    Decorator that ensures a class has only one instance (singleton pattern).
    """
    instances = {}

    def getinstance(*args, **kwargs):
        if class_ not in instances:
            instances[class_] = class_(*args, **kwargs)
        return instances[class_]

    return getinstance


def override(f):
    """
    Decorator to indicate that a method overrides a method in a superclass.
    """
    return f
