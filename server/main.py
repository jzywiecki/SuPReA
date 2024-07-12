from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import List, Union
from datetime import datetime, timedelta
import jwt
from fastapi.security import OAuth2PasswordBearer
from typing_extensions import Annotated
from .models import User, Token, TokenData, UserInDB
# from .routers import authorization

from server.routers import (
    project,
    actors,
    business_scenarios,
    elevator_speech,
    motto,
    project_schedule,
    uml,
    database_schema,
)
from server.routers import requirement, risk, specifications, strategy, title
from fastapi.middleware.cors import CORSMiddleware

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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
app.include_router(database_schema.router)
# app.include_router(authorization.router)
