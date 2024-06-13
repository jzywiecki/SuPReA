from openai import OpenAI
from enum import Enum

client = OpenAI()

class Model(Enum):
    GPT3 = "gpt-3.5-turbo"
    
def sendAIRequest(Model, messages, response_format, maxTokens):
    params = {"model": Model.value, "messages": messages, "max_tokens": maxTokens}
    chat_completion = client.chat.completions.create(**params)

    return chat_completion
