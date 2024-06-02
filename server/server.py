import asyncio
import logging

from utils import logger
# ----------------------------
from modules.umlModule.routes import UmlModule 
# ----------------------------
import modules.actors_module.routes as actors
# ----------------------------
from modules.business_scenarios.routes import BusinessModule
# ----------------------------
from modules.elevator_speech.routes import ElevatorSpeechModule
# ----------------------------
from modules.title.routes import TitleModule
# ----------------------------
from modules.project_schedule.routes import ScheduleModule
# ----------------------------
from modules.database_schema.routes import DatabaseSchemaModule
# ----------------------------
from modules.logo.routes import LogoModule
# ----------------------------
import modules.risk_module.routes as risks
import modules.specifications_module.routes as specifications
import modules.strategy_module.routes as strategy
import modules.motto_module.routes as motto_module
import modules.requirements_module.routes as requirements_module
import utils.openaiUtils as utils 
# ----------------------------
ABS_DRIVER_PATH='D:\Magazyn\Studia\Inzynierka\intelligent-system-supporting-project-requirements-analysis\server\chromeDriver\chromedriver.exe'
IMAGE_API_KEY=""

if __name__ == "__main__":
    logger.configure_logging()
    logger = logging.getLogger("server")
    logger.info("Server started")
    is_mock=True
    logger.info(f"Mocking is: {is_mock}")

    loop = asyncio.get_event_loop()

    actors = actors.ActorsModule(utils.Model.GPT3)
    uml_generator = UmlModule(utils.Model.GPT3)
    business_generator = BusinessModule(utils.Model.GPT3)
    speech_generator = ElevatorSpeechModule(utils.Model.GPT3)
    title_generator = TitleModule(utils.Model.GPT3)
    schedule_generator = ScheduleModule(utils.Model.GPT3)
    database_schema_generator = DatabaseSchemaModule(utils.Model.GPT3)
    logo_generator = LogoModule(utils.Model.GPT3)
    risks = risks.RiskModule(utils.Model.GPT3)
    specifications = specifications.SpecificationsModule(utils.Model.GPT3)
    strategies = strategy.StrategyModule(utils.Model.GPT3)
    motto = motto_module.MottoModule(utils.Model.GPT3)
    requirements = requirements_module.RequirementsModule(utils.Model.GPT3)

    logger.info("Generating actors")
    loop.run_until_complete(actors.get_content("startupu", "wyprowadzania psów"))

    logger.info("Generating risks")
    loop.run_until_complete(risks.get_content("startupu", "wyprowadzania psów"))

    logger.info("Generating specifications")
    loop.run_until_complete(specifications.get_content("startupu", "wyprowadzania psów"))

    logger.info("Generating strategies")
    loop.run_until_complete(strategies.get_content("startupu", "wyprowadzania psów"))

    logger.info("Generating motto")
    loop.run_until_complete(motto.get_content("startupu", "wyprowadzania psów"))

    logger.info("Generating requirements")
    loop.run_until_complete(requirements.get_content("startupu", "wyprowadzania psów"))
    
    logger.info("Generating uml list")
    loop.run_until_complete(uml_generator.get_content("","",uml_list=True,is_mock=is_mock))

    logger.info("Generating uml images")
    loop.run_until_complete(uml_generator.get_content("","", is_mock=is_mock))

    logger.info("Generating busines scenraios")
    loop.run_until_complete(business_generator.get_content("","", is_mock=is_mock))

    logger.info("Generating elevator speech")
    loop.run_until_complete(speech_generator.get_content("","", is_mock=is_mock))

    logger.info("Generating title")
    loop.run_until_complete(title_generator.get_content("","", is_mock=is_mock))

    logger.info("Generating schedule")
    loop.run_until_complete(schedule_generator.get_content("","", is_mock=is_mock))

    logger.info("Generating database schema")
    loop.run_until_complete(database_schema_generator.get_content("","", is_mock=is_mock, driver= ABS_DRIVER_PATH))

    logger.info("Generating logo images")
    loop.run_until_complete(logo_generator.get_content("","", is_mock=is_mock, images=1, api_key=IMAGE_API_KEY))




