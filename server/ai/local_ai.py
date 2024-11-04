from ai.ai import AI
import ray
from openai import OpenAI
from utils.decorators import override

local_client = OpenAI(base_url="http://localhost:1234/v1")


class LocalModel(AI):
    """Base class for local models."""

    @override
    def make_ai_call(self, query: str, model_name: str) -> str:
        """Make a call to the local model and return the response."""
        messages = [{"role": "system", "content": query, "type": "json_object"}]
        params = {"model": model_name, "messages": messages, "max_tokens": 4000}
        response = local_client.chat.completions.create(**params)
        return response.choices[0].message.content


class Llama32(LocalModel):
    @override
    def name(self) -> str:
        return "Llama-3.2"

    @override
    def make_ai_call(self, query: str) -> str:
        """Make a call to the Llama-3.2 model and return the response."""
        return super().make_ai_call(query, "mlx-community/Llama-3.2-3B-Instruct-4bit")


llama_32 = Llama32()

llama_32_remote_ref = ray.put(llama_32)
