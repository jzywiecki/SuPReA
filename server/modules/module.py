import abc


class Module(metaclass=abc.ABCMeta):
    @classmethod
    def __subclasshook__(cls, subclass):
        return (
            hasattr(subclass, "get_content")
            and callable(subclass.get_content)
            or NotImplemented
        )

    @abc.abstractmethod
    def get_content(self, for_who, doing_what, additional_info, is_mock, **kwargs):
        """Get content for given for_who and doing_what and return the response"""
        raise NotImplementedError
