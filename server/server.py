import asyncio
from utils import logger
# ----------------------------
from modules.umlModule.routes import generate_uml_list
from modules.umlModule.routes import generate_uml_images
# ----------------------------
import modules.actorsModule.routes as actors
import utils.openaiUtils as utils 
# ----------------------------

async def server():
    await generate_uml_list()
    await generate_uml_images()

if __name__ == "__main__":
    actors = actors.ActorsModule(utils.Model.GPT3)
    
    loop = asyncio.get_event_loop()
    loop.run_until_complete(actors.get_content("systemu", "tworzenia aplikacji"))
    #logger.configure_logging()
    #asyncio.run(server())

