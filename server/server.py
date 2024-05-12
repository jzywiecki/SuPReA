import asyncio
from utils import logger

# ----------------------------
from modules.umlModule.routes import generate_uml_list
from modules.umlModule.routes import generate_uml_images
# ----------------------------

async def server():
    await generate_uml_list()
    await generate_uml_images()

if __name__ == "__main__":
    logger.configure_logging()
    asyncio.run(server())
