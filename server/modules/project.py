import ray

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

    def generate_components_by_ai(self, ai_model, for_what, doing_what, additional_info):
        for actor in self.actors:
            actor.generate_by_ai.remote(ai_model, for_what, doing_what, additional_info)

    # TODO: below method can throw exception. Handle it.
    def save_components_to_database(self, project_id):
        for actor in self.actors:
            value_ref = actor.get_value.remote()
            try:     # TEMPORARY EXCEPTION HANDLING
                value = ray.get(value_ref)
                if value is not None:
                    continue
                actor.save_to_database.remote(project_id)
            except Exception as e:
                print("Exception in save_components_to_database: ", e)
                continue
