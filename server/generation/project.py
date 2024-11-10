"""
Module contains general high-level functions for generate projects using AI models.
"""

import ray

from .model.actors import ActorsGenerate
from .model.business_scenarios import BusinessScenariosGenerate
from .model.database_schema import DatabaseSchemaGenerate
from .model.elevator_speech import ElevatorSpeechGenerate
from .model.logo import LogoGenerate
from .model.motto import MottoGenerate
from .model.project_schedule import ProjectScheduleGenerate
from .model.requirements import RequirementsGenerate
from .model.risks import RiskGenerate
from .model.specifications import SpecificationsGenerate
from .model.strategy import StrategyGenerate
from .model.title import TitleGenerate
from .model.suggested_technologies import SuggestedTechnologiesGenerate
from .model.mockups import MockupsGenerate
from .generate import GenerateActor, GenerateWithMonitor
from utils import WrongFormatGeneratedByAI, logger
from ai import AI
import callback.realtime_server as realtime_server

MAX_RE_REGENERATION = 5


@ray.remote
class ProjectAIGenerationActor:
    """
    Main actor that generates components by AI, saves them to the database and handles failures.
    """

    def __init__(self, callback):
        self.logo_actor = GenerateActor.remote(GenerateWithMonitor(LogoGenerate()))
        self.mockups_actor = GenerateActor.remote(GenerateWithMonitor(MockupsGenerate()))
        self.actors = [
            GenerateActor.remote(GenerateWithMonitor(ActorsGenerate())),
            GenerateActor.remote(GenerateWithMonitor(BusinessScenariosGenerate())),
            GenerateActor.remote(GenerateWithMonitor(DatabaseSchemaGenerate())),
            GenerateActor.remote(GenerateWithMonitor(ElevatorSpeechGenerate())),
            self.logo_actor,
            self.mockups_actor,
            GenerateActor.remote(GenerateWithMonitor(MottoGenerate())),
            GenerateActor.remote(GenerateWithMonitor(ProjectScheduleGenerate())),
            GenerateActor.remote(GenerateWithMonitor(RequirementsGenerate())),
            GenerateActor.remote(GenerateWithMonitor(RiskGenerate())),
            GenerateActor.remote(GenerateWithMonitor(SpecificationsGenerate())),
            GenerateActor.remote(GenerateWithMonitor(StrategyGenerate())),
            GenerateActor.remote(GenerateWithMonitor(TitleGenerate())),
            GenerateActor.remote(GenerateWithMonitor(SuggestedTechnologiesGenerate())),
        ]
        self.generate_future = []  # Contains futures of generation components by AI.
        self.db_future = []  # Contains futures of saving components to the database.
        self.failure_actor = (
            []
        )  # Contains components that failed to generation or saving.
        self.callback_future = []
        self.callback = callback

    def generate_components_by_ai(
        self,
        ai_text_model: AI,
        ai_image_model: AI,
        for_what: str,
        doing_what: str,
        additional_info: str,
    ):
        """
        Run remote tasks to generate components by AI.
        """
        for actor in self.actors:
            if actor is self.logo_actor or actor is self.mockups_actor:
                self.generate_future.append(
                    actor.generate_by_ai.remote(
                        ai_image_model, for_what, doing_what, additional_info
                    )
                )
            else:
                self.generate_future.append(
                    actor.generate_by_ai.remote(
                        ai_text_model, for_what, doing_what, additional_info
                    )
                )

    def save_components_and_regenerate_failure_by_ai(
        self,
        ai_text_model: AI,
        get_project_dao_ref,
        for_what: str,
        doing_what: str,
        additional_info: str,
        project_id: str,
    ):
        """
        Run remote tasks to save components into database.

        If AI generates a correct format of the component, save it to the database.
        If component is saved, notify the user about it.

        If AI generates a wrong format, regenerate the component (max MAX_RE_REGENERATION times) and save it again.
        If the component still fails or unknown exception occurred, add it to the failure list.
        """
        re_regeneration_count = 0

        def regeneration_handler():
            nonlocal re_regeneration_count
            ready_components, self.generate_future = ray.wait(
                self.generate_future, num_returns=1, timeout=None
            )
            for actor_ref in ready_components:
                try:
                    actor, error = ray.get(actor_ref)

                    # Correctly generated component case.
                    if error is None:
                        self.db_future.append(
                            actor.save_to_database.remote(
                                get_project_dao_ref, project_id
                            )
                        )

                    # AI generated a wrong format case.
                    elif isinstance(error, WrongFormatGeneratedByAI):
                        if re_regeneration_count < MAX_RE_REGENERATION:
                            re_regeneration_count += 1
                            self.generate_future.append(
                                actor.generate_by_ai.remote(
                                    ai_text_model, for_what, doing_what, additional_info
                                )
                            )
                        else:
                            self.failure_actor.append(actor)

                    # Unexpected exception during generations.
                    else:
                        self.failure_actor.append(actor)

                except Exception as e:
                    logger.error(f"{e}")
                    raise e

        def notify_about_ready_components():
            saved_in_db_components, self.db_future = ray.wait(
                self.db_future, num_returns=1, timeout=0
            )
            for actor_ref in saved_in_db_components:
                try:
                    actor, error = ray.get(actor_ref)

                    # Correctly saved component to db case.
                    if error is None:
                        component_identify = ray.get(
                            actor.get_component_identify.remote()
                        )
                        self.callback_future.append(
                            realtime_server.notify_task.remote(
                                realtime_server.notify_generation_complete,
                                component_identify.value,
                                self.callback,
                            )
                        )

                    else:
                        self.failure_actor.append(actor)
                except Exception as e:
                    logger.error(f"{e}")

        while self.generate_future:
            regeneration_handler()
            notify_about_ready_components()

    def save_to_database_service(self):
        """
        Check if all components are saved to the database. If not, add them to the failure list.
        """
        for actor_ref in self.db_future:
            try:
                actor, error = ray.get(actor_ref)
                if error is None:
                    component_identify = ray.get(actor.get_component_identify.remote())
                    self.callback_future.append(
                        realtime_server.notify_task.remote(
                            realtime_server.notify_generation_complete,
                            component_identify.value,
                            self.callback,
                        )
                    )

                else:
                    self.failure_actor.append(actor)

            except Exception as e:
                logger.error(f"{e}")
                raise e

    def set_default_value_for_failure_actor(self, get_project_dao_ref, project_id):
        for actor in self.failure_actor:
            try:
                ray.get(actor.default_value.remote())
                ray.get(actor.save_to_database.remote(get_project_dao_ref, project_id))

                component_identify = ray.get(actor.get_component_identify.remote())
                self.callback_future.append(
                    realtime_server.notify_task.remote(
                        realtime_server.notify_generation_complete,
                        component_identify.value,
                        self.callback,
                    )
                )

            except Exception as e:
                logger.error(f"{e}")
                raise e

    def wait_for_callback_future(self):
        for actor_ref in self.callback_future:
            try:
                ray.get(actor_ref)
            except Exception as e:
                logger.error(f"{e}")


@ray.remote
def generate_project_components_task(
    project_id: str,
    for_what: str,
    doing_what: str,
    additional_info: str,
    ai_text_model: AI,
    ai_image_model: AI,
    get_project_dao_ref,
    callback: str,
):
    """
    Initiates the remote generation of project components by AI models and handles their saving to the database.
    """
    project_ai_actor = ProjectAIGenerationActor.remote(callback)
    generate_task = project_ai_actor.generate_components_by_ai.remote(
        ai_text_model, ai_image_model, for_what, doing_what, additional_info
    )
    regenerate_task = (
        project_ai_actor.save_components_and_regenerate_failure_by_ai.remote(
            ai_text_model,
            get_project_dao_ref,
            for_what,
            doing_what,
            additional_info,
            project_id,
        )
    )
    save_check_task = project_ai_actor.save_to_database_service.remote()
    set_default_value_task = (
        project_ai_actor.set_default_value_for_failure_actor.remote(
            get_project_dao_ref, project_id
        )
    )
    wait_for_callback_task = project_ai_actor.wait_for_callback_future.remote()

    try:
        ray.get(generate_task)
        ray.get(regenerate_task)
        ray.get(save_check_task)
        ray.get(set_default_value_task)
        ray.get(wait_for_callback_task)
        logger.info(f"Generate components remote wrapper finished work.")
    except Exception as e:
        logger.error(f"{e}")