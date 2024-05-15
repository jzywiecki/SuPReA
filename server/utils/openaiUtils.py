from openai import OpenAI
from enum import Enum

client = OpenAI(api_key="sk-proj-7snYR4D7O3AjawkMVZ8vT3BlbkFJ2YNNMy8ardHb59LO9B7q")

class Model(Enum):
    GPT3 = "gpt-3.5-turbo"
    GPT4 = "gpt-4.0-turbo"
    
def sendAIRequest(Model, messages, response_format, maxTokens):
    params = {"model": Model.value, "messages": messages, "max_tokens": maxTokens}
    # params["response_format"] = response_format
    chat_completion = client.chat.completions.create(**params)

    return chat_completion


