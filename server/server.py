import asyncio
import logging

from utils import logger
# ----------------------------
from modules.umlModule.routes import UmlModule 
# ----------------------------
import modules.actorsModule.routes as actors
# ----------------------------
from modules.business_scenarios.routes import BusinessModule
# ----------------------------
import utils.openaiUtils as utils 
# ----------------------------

if __name__ == "__main__":
    logger.configure_logging()
    logger = logging.getLogger("server")
    logger.info("Server started")
    is_mock=True
    logger.info(f"Mocking is: {is_mock}")

    loop = asyncio.get_event_loop()
    
    # actors = actors.ActorsModule(utils.Model.GPT3)
    # uml_generator = UmlModule(utils.Model.GPT3)
    business_generator = BusinessModule(utils.Model.GPT3)
    
    # logger.info("Generating actors")
    # loop.run_until_complete(actors.get_content("systemu", "tworzenia aplikacji"))
    
    # logger.info("Generating uml list")
    # loop.run_until_complete(uml_generator.get_content("","",uml_list=True,is_mock=is_mock))
    # logger.info("Generating uml images")
    # loop.run_until_complete(uml_generator.get_content("","", is_mock=is_mock))

    logger.info("Generating busines scenraios")
    loop.run_until_complete(business_generator.get_content("","", is_mock=is_mock))

