import abc


class Module(metaclass=abc.ABCMeta):
    @classmethod
    def __subclasshook__(cls, subclass):
        return (
            hasattr(subclass, "get_content")
            and callable(subclass.create_model_json)
            or NotImplemented
        )

    def build_create_query(
        self,
        for_who_input,
        doing_what_input,
        additional_info_input,
        for_who_sentence,
        doing_what_sentence,
        query_expectations,
    ):
        request = (
            for_who_sentence
            + " "
            + for_who_input
            + " "
            + doing_what_sentence
            + " "
            + doing_what_input
            + " "
            + query_expectations
            + " "
            + additional_info_input
        )
        return request

    @abc.abstractmethod
    def create_model_json(
        self, for_who_input, doing_what_input, additional_info_input, is_mock, **kwargs
    ):
        """Get content for given for_who and doing_what and return the response"""
        raise NotImplementedError
