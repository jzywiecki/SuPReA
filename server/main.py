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
    suggested_technologies,
    mockups,
)
from fastapi.middleware.cors import CORSMiddleware
from utils import register_fastapi_exception_handlers


app = FastAPI()
register_fastapi_exception_handlers(app)

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
app.include_router(suggested_technologies.router)
app.include_router(mockups.router)
