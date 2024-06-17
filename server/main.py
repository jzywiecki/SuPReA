from fastapi import FastAPI
from server.routers import (
    project,
    actors,
    business_scenarios,
    elevator_speech,
    motto,
    project_schedule,
    uml,
)
from server.routers import requirement, risk, specifications, strategy, title

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(project.router)
app.include_router(actors.router)
app.include_router(business_scenarios.router)
app.include_router(elevator_speech.router)
app.include_router(motto.router)
app.include_router(project_schedule.router)
app.include_router(requirement.router)
app.include_router(risk.router)
app.include_router(specifications.router)
app.include_router(strategy.router)
app.include_router(title.router)
app.include_router(uml.router)
