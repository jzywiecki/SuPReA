"""
Module contains general high-level functions for generate projects using AI models.
"""

import ray

from .actors import ActorsGenerate
from .business_scenarios import BusinessScenariosGenerate
from .database_schema import DatabaseSchemaGenerate
from .elevator_speech import ElevatorSpeechGenerate
from .logo import LogoGenerate
from .motto import MottoGenerate
from .project_schedule import ProjectScheduleGenerate
from .requirements import RequirementsGenerate
from .risks import RiskGenerate
from .specifications import SpecificationsGenerate
from .strategy import StrategyGenerate
from .title import TitleGenerate
from .remote import GenerateActor
from utils import WrongFormatGeneratedByAI, logger

MAX_RE_REGENERATION = 5


@ray.remote
class ProjectAIGenerationActor:
    """
    Main actor that generates components by AI, saves them to the database and handles failures.
    """

    def __init__(self):
        self.logo_actor = GenerateActor.remote(LogoGenerate())
        self.actors = [
            GenerateActor.remote(ActorsGenerate()),
            GenerateActor.remote(BusinessScenariosGenerate()),
            GenerateActor.remote(DatabaseSchemaGenerate()),
            GenerateActor.remote(ElevatorSpeechGenerate()),
            self.logo_actor,
            GenerateActor.remote(MottoGenerate()),
            GenerateActor.remote(ProjectScheduleGenerate()),
            GenerateActor.remote(RequirementsGenerate()),
            GenerateActor.remote(RiskGenerate()),
            GenerateActor.remote(SpecificationsGenerate()),
            GenerateActor.remote(StrategyGenerate()),
            GenerateActor.remote(TitleGenerate()),
        ]
        self.generate_future = []
        self.db_future = []
        self.failure_actor = []

    def generate_components_by_ai(
        self, ai_text_model, ai_image_model, for_what, doing_what, additional_info
    ):
        """
        Run remote tasks to generate components by AI.
        """
        for actor in self.actors:
            if actor is self.logo_actor:
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
        self, ai_text_model, for_what, doing_what, additional_info, project_id
    ):
        """
        Run remote tasks to save components into database.
        If AI generates a wrong format, regenerate the component (max MAX_RE_REGENERATION times) and save it again.
        If the component still fails or unknown exception occurred, add it to the failure list.
        """
        re_regeneration_count = 0

        while self.generate_future:
            ready_components, self.generate_future = ray.wait(
                self.generate_future, num_returns=1, timeout=None
            )
            for actor_ref in ready_components:
                try:
                    actor, error = ray.get(actor_ref)

                    if error is None:
                        self.db_future.append(actor.save_to_database.remote(project_id))

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

                    else:  # unknown exception occurred
                        self.failure_actor.append(actor)

                except Exception as e:
                    logger.error(f"{e}")
                    raise e

    def save_to_database_service(self):
        """
        Check if all components are saved to the database. If not, add them to the failure list.
        """
        for actor_ref in self.db_future:
            try:
                actor, error = ray.get(actor_ref)
                if error is not None:
                    self.failure_actor.append(actor)

            except Exception as e:
                logger.error(f"{e}")
                raise e


@ray.remote
def generate_project_components_task (
    project_id, for_what, doing_what, additional_info, ai_text_model, ai_image_model
):
    """
    Initiates the remote generation of project components by AI models and handles their saving to the database.
    """
    project_ai_actor = ProjectAIGenerationActor.remote()
    generate_task = project_ai_actor.generate_components_by_ai.remote(
        ai_text_model, ai_image_model, for_what, doing_what, additional_info
    )
    regenerate_task = (
        project_ai_actor.save_components_and_regenerate_failure_by_ai.remote(
            ai_text_model, for_what, doing_what, additional_info, project_id
        )
    )
    save_check_task = project_ai_actor.save_to_database_service.remote()

    try:
        ray.get(generate_task)
        ray.get(regenerate_task)
        ray.get(save_check_task)
        logger.info(f"Generate components remote wrapper finished work.")
    except Exception as e:
        logger.error(f"{e}")
