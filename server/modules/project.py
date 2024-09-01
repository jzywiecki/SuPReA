import ray
import json

from .actors import ActorsModule
from .business_scenarios import BusinessScenariosModule
from .database_schema import DatabaseSchemaModule
from .elevator_speech import ElevatorSpeechModule
from .logo import LogoModule
from .motto import MottoModule
from .project_schedule import ProjectScheduleModule
from .requirements import RequirementsModule
from .risks import RiskModule
from .specifications import SpecificationsModule
from .strategy import StrategyModule
from .title import TitleModule


@ray.remote
class ProjectAIGenerationActor:
    def __init__(self):
        self.actors_actor = ActorsModule.remote()
        self.business_scenarios_actor = BusinessScenariosModule.remote()
        self.database_schema_actor = DatabaseSchemaModule.remote()
        self.elevator_speech_actor = ElevatorSpeechModule.remote()
        self.logo_actor = LogoModule.remote()
        self.motto_actor = MottoModule.remote()
        self.project_schedule_actor = ProjectScheduleModule.remote()
        self.requirements_actor = RequirementsModule.remote()
        self.risks_actor = RiskModule.remote()
        self.specifications_actor = SpecificationsModule.remote()
        self.strategy_actor = StrategyModule.remote()
        self.title_actor = TitleModule.remote()
        self.actors = [
            self.actors_actor,
            self.business_scenarios_actor,
            self.database_schema_actor,
            self.elevator_speech_actor,
            self.logo_actor,
            self.motto_actor,
            self.project_schedule_actor,
            self.requirements_actor,
            self.risks_actor,
            self.specifications_actor,
            self.strategy_actor,
            self.title_actor,
        ]

    def generate_components_by_ai(self, ai_text_model, ai_image_model, for_what, doing_what, additional_info):
        for actor in self.actors:
            if actor is self.logo_actor:
                actor.generate_by_ai.remote(ai_image_model, for_what, doing_what, additional_info)
            else:
                actor.generate_by_ai.remote(ai_text_model, for_what, doing_what, additional_info)

    def regenerate_failure_components_by_ai(self, ai_text_model, ai_image_model, for_what, doing_what, additional_info):
        for actor in self.actors:
            try:
                value = ray.get(actor.get_value.remote())
                if value is None:
                    raise json.JSONDecoder
            except json.JSONDecoder:
                if actor is self.logo_actor:
                    actor.generate_by_ai.remote(ai_image_model, for_what, doing_what, additional_info)
                else:
                    actor.generate_by_ai.remote(ai_text_model, for_what, doing_what, additional_info)

    # TODO: below method can throw exception. Handle it. Methods can be parallelized.
    def save_components_to_database(self, project_id):
        for actor in self.actors:
            try:
                value = ray.get(actor.get_value.remote())
                if value is None:
                    continue
                ray.get(actor.save_to_database.remote(project_id))
            except Exception as e:
                print("Exception in save_components_to_database: ", e)
                continue


@ray.remote
def generate_components_remote_wrapper(project_id, for_what, doing_what, additional_info, ai_text_model, ai_image_model):
    project_ai_actor = ProjectAIGenerationActor.remote()
    generate_task = project_ai_actor.generate_components_by_ai.remote(ai_text_model, ai_image_model, for_what, doing_what, additional_info)
    regenerate_task = project_ai_actor.regenerate_failure_components_by_ai.remote(ai_text_model, ai_image_model, for_what, doing_what, additional_info)
    save_task = project_ai_actor.save_components_to_database.remote(project_id)

    ray.get(generate_task)
    ray.get(regenerate_task)
    ray.get(save_task)
