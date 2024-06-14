import abc


class Module(metaclass=abc.ABCMeta):
    @classmethod
    def __subclasshook__(cls, subclass):
        return (
            hasattr(subclass, "make_ai_call")
            and callable(subclass.make_ai_call)
            and hasattr(subclass, "get_content")
            and callable(subclass.get_content)
            or NotImplemented
        )

    @abc.abstractmethod
    def make_ai_call(self, message, msg_type):
        """Make a call to ai model of type with given message and return the response"""
        raise NotImplementedError

    @abc.abstractmethod
    def get_content(self, for_who, doing_what, additional_info, is_mock, **kwargs):
        """Get content for given for_who and doing_what and return the response"""
        raise NotImplementedError
