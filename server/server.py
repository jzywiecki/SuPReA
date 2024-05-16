import asyncio
from utils import logger
# ----------------------------
from modules.umlModule.routes import generate_uml_list
from modules.umlModule.routes import generate_uml_images
# ----------------------------
import modules.actors_module.routes as actors
import modules.risk_module.routes as risks
import modules.specifications_module.routes as specifications
import modules.strategy_module.routes as strategy
import utils.openaiUtils as utils 
# ----------------------------

async def server():
    await generate_uml_list()
    await generate_uml_images()

if __name__ == "__main__":
    actors = actors.ActorsModule(utils.Model.GPT3)
    risks = risks.RiskModule(utils.Model.GPT3)
    specifications = specifications.SpecificationsModule(utils.Model.GPT3)
    strategies = strategy.StrategyModule(utils.Model.GPT3)

    loop = asyncio.get_event_loop()
    loop.run_until_complete(actors.get_content("startupu", "wyprowadzania psów"))
    loop.run_until_complete(risks.get_content("startupu", "wyprowadzania psów"))
    loop.run_until_complete(specifications.get_content("startupu", "wyprowadzania psów"))
    loop.run_until_complete(strategies.get_content("startupu", "wyprowadzania psów"))

    #logger.configure_logging()
    #asyncio.run(server())

