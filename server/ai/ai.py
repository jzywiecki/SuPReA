import abc

class AI(metaclass=abc.ABCMeta):
    @abc.abstractmethod
    def generate(self, request):
        raise NotImplementedError