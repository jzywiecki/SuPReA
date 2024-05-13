import abc

class Module(metaclass=abc.ABCMeta):
    @classmethod
    def __subclasshook__(cls, subclass):
        return (hasattr(subclass, 'make_ai_call') and 
                callable(subclass.make_ai_call) and 
                hasattr(subclass, 'get_content') and 
                callable(subclass.get_content) or 
                NotImplemented)

    @abc.abstractmethod
    def make_ai_call(self, message, type):
        """ Make a call to ai model of type with given message and return the response """
        raise NotImplementedError

    @abc.abstractmethod
    async def get_content(self, forWho, doingWhat):
        """ Get content for given forWho and doingWhat and return the response """
        raise NotImplementedError
