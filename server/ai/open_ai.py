from openai import OpenAI

from ai.ai import AI

client = OpenAI()

class GPT35Turbo(AI):
    def generate(self, request):
        messages = [{"role": "system", "content": request, "type": "json_object"}]
        params = {"model": "gpt-3.5-turbo", "messages": messages, "max_tokens": 4000}
        response = client.chat.completions.create(**params)
        return response.choices[0].message.content


class DallE3(AI):
    def generate(self, request):
        params = {"model": "dall-e-3", "prompt": request, "size": "1024x1024", "quality": "standard", "n": 1}
        response = client.images.generate(**params)
        return response.data[0].url