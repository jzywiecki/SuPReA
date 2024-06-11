from fastapi import FastAPI
from fastapi import BackgroundTasks
from server.modules.actors.routes import ActorsModule
from server.modules.business_scenarios.routes import BusinessModule
from server.modules.database_schema.routes import DatabaseSchemaModule
from server.modules.elevator_speech.routes import ElevatorSpeechModule
# from server.modules.logo.routes import LogoModule
from server.modules.project_schedule.routes import ScheduleModule
from server.modules.title.routes import TitleModule
from server.modules.uml.routes import UmlModule
from server.utils.openaiUtils import Model

app = FastAPI()

database = []

@app.get("/")
def read_root():
    return "Hello world!"


@app.post("/generate-app")
async def generate_app(forWho: str, doingWhat: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(generator, forWho, doingWhat)
    return 

@app.get("/get-database")
def get_database():
    return database

def generator(forWho: str, doingWhat: str):
    for module in declare_text_modules(Model.GPT3):
        returned_value = module.get_content(forWho, doingWhat)
        if returned_value is not None:
            database.append(returned_value)
            print(returned_value)
            print("----------------------")


def declare_text_modules(llm_model: Model):
    actors = ActorsModule(llm_model)
    # uml_generator = UmlModule(llm_model)
    # business_generator = BusinessModule(llm_model)
    # speech_generator = ElevatorSpeechModule(llm_model)
    # title_generator = TitleModule(llm_model)
    # schedule_generator = ScheduleModule(llm_model)
    # database_schema_generator = DatabaseSchemaModule(llm_model)
    # logo_generator = LogoModule(llm_model)

    # return [actors, uml_generator, business_generator, speech_generator, title_generator, schedule_generator, database_schema_generator]
    return [actors]
