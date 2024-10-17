from fastapi import FastAPI
from routers import (
    actors,
    business_scenarios,
    elevator_speech,
    motto,
    project_schedule,
    database_schema,
    specifications,
    strategy,
    title,
    projects,
    requirements,
    risks,
    download,
    logo,
    question,
)
from fastapi.middleware.cors import CORSMiddleware
from utils import register_fastapi_exception_handlers


app = FastAPI()
register_fastapi_exception_handlers(app)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router)
app.include_router(actors.router)
app.include_router(business_scenarios.router)
app.include_router(elevator_speech.router)
app.include_router(motto.router)
app.include_router(project_schedule.router)
app.include_router(requirements.router)
app.include_router(risks.router)
app.include_router(specifications.router)
app.include_router(strategy.router)
app.include_router(title.router)
app.include_router(database_schema.router)
app.include_router(download.router)
app.include_router(logo.router)
app.include_router(question.router)
