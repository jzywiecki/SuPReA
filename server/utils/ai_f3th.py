
import openai
api_key = "sk-proj-7snYR4D7O3AjawkMVZ8vT3BlbkFJ2YNNMy8ardHb59LO9B7q"
client = openai.OpenAI(api_key=api_key)

async def send_openai_request(model, messages, format=None, max_tokens=None):
    params = {"model": model, "messages": messages}
    if format is not None:
        params["response_format"] = format
    if max_tokens is not None:
        params["max_tokens"] = max_tokens

    try:
        response = await client.chat.completions.create(**params)
        if not response or not response.choices or not response.choices[0].message.content or len(response.choices) == 0:
            raise Exception(f"Empty or invalid response from {model} model")
        return response.choices[0].message.content
    except Exception as error:
        raise Exception(f"An error occurred while fetching data from {model} model: {error}")

async def make_ai_call(message, type):
    return await send_openai_request(
        "gpt-3.5-turbo-0125",
        [
            {"role": "system", "content": "You are a helpful software design assistant."},
            {"role": "user", "content": [{"type": "text", "text": message}]}
        ],
        type,
        4000
    )
