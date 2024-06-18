import os
import uuid
import server.modules.module.module as modules
import server.utils.openaiUtils as utils
import logging
from openai import OpenAI
import asyncio
import requests
from PIL import Image
from io import BytesIO
import random
import string
from datetime import datetime

# def random_name():
#     current_time = datetime.now().strftime("%Y%m%d%H%M%S")
#     random_suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
#     return f"Z{current_time}_{random_suffix}"


# ----------------------------------------FETCH
prompt = "A logo for a company."
details = "logo topic: walking dogs."
additional_details1 = "The logo should be simple and colorful. The whole background should be white. The image is a single logo with no additional content.."
additional_details2 = "The logo should be simple and not colorful. The whole background should be white. Don't put additional content on picture instead of logo. The image is a single logo with no additional content."
additional_details3 = "The logo should be for children. The whole background should be white. Don't put additional content on picture instead of logo. The image is a single logo with no additional content."
additional_details4 = "The logo should be funny. The whole background should be white. Don't put additional content on picture instead of logo. The image is a single logo with no additional content."

model = "dall-e-3"
n = 1


async def fetch_logo(client, prompt, details, additional_details, model, n, path):
    response = client.images.generate(
        model=model,
        prompt=prompt + " details: " + details + " " + additional_details,
        size="1024x1024",
        quality="standard",
        n=n,
    )
    for i in range(n):
        image_url = response.data[i].url
        image_response = requests.get(image_url)
        image = Image.open(BytesIO(image_response.content))
        path = os.path.join(path, f"{random_name()}{model}.png")
        image.save(path)


# ----------------------------------------ROUTES
async def generate_logo(client):
    random_uuid = uuid.uuid4()
    await asyncio.gather(
        fetch_logo(client, prompt, details, additional_details1, model, n, path),
        # fetch_logo(client, prompt, details, additional_details2, model, n,path),
        # fetch_logo(client, prompt, details, additional_details3, model, n,path),
        # fetch_logo(client, prompt, details, additional_details4, model, n,path),
    )
    images = kwargs.get("images")
    tasks = []
    for _ in range(images):
        task = asyncio.create_task(
            fetch_logo(client, prompt, details, additional_details1, model, n)
        )
        tasks.append(task)
    await asyncio.gather(*tasks)


class LogoModule(modules.Module):
    def __init__(self, model):
        self.Model = model

    def make_ai_call(self, message, msg_type):
        messages = [{"role": "system", "content": message}]
        response = utils.sendAIRequest(self.Model, messages, msg_type, 4000)
        return response.choices[0].message.content

    async def get_content(
        self, for_who, doing_what, additional_info, is_mock, **kwargs
    ):
        await generate_logo(client)
        return None
