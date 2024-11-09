"""
This module defines custom exception classes and registers exception handlers for a FastAPI application.
It ensures that specific errors are handled gracefully and provides informative error responses to clients.
"""

from fastapi import HTTPException, Request, FastAPI, status
from fastapi.responses import JSONResponse
from utils import logger
from bson.errors import InvalidId


class RayUnexpectedException(Exception):
    """Exception raised when an unexpected error occurs in Ray."""

    def __init__(self, details: str):
        super().__init__(details)
        self.details = details

    def __str__(self):
        return f"RayUnexpectedException: {self.details}"


class WrongFormatGeneratedByAI(Exception):
    """Exception raised when an AI-generated format is incorrect."""
    pass


class ProjectNotFound(Exception):
    """Exception raised when a requested project is not found."""

    def __init__(self, project_id: str):
        self.project_id = project_id
        super().__init__(f"Project with id: '{project_id}' not found")


class ComponentNotFound(Exception):
    """Exception raised when a specific component is not found within a project."""

    def __init__(self, project_id: str, component_name: str):
        self.component_name = component_name
        self.project_id = project_id
        super().__init__(f"{component_name}' not found in project: '{project_id}'")


class InvalidParameter(Exception):
    """Exception raised when an invalid parameter is provided."""

    def __init__(self, details: str):
        super().__init__(details)
        self.details = details


class AIModelNotFound(Exception):
    """Exception raised when an AI model is not found."""

    def __init__(self, model_name: str):
        super().__init__(f"Model '{model_name}' not found")
        self.model_name = model_name


def register_fastapi_exception_handlers(app: FastAPI) -> None:
    """
    Registers exception handlers for a FastAPI application to handle various custom exceptions and HTTP errors.

    :param app: The FastAPI application instance.
    """

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        logger.error(f"HTTPException occurred: {exc.detail}")
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
        )

    @app.exception_handler(InvalidId)
    async def invalid_id_exception_handler(request: Request, exc: InvalidId):
        logger.error("Invalid ID provided")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail": "Invalid ID provided"},
        )

    @app.exception_handler(ComponentNotFound)
    async def model_not_found_exception_handler(
        request: Request, exc: ComponentNotFound
    ):
        logger.error(f"{exc.component_name} not found in project: {exc.project_id}")
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "detail": f"{exc.component_name} not found in project: {exc.project_id}"
            },
        )

    @app.exception_handler(ProjectNotFound)
    async def project_not_found_exception_handler(
        request: Request, exc: ProjectNotFound
    ):
        logger.error(f"Project with id: {exc.project_id} not found")
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"detail": f"Project with id: {exc.project_id} not found"},
        )

    @app.exception_handler(InvalidParameter)
    async def invalid_parameter_exception_handler(
        request: Request, exc: InvalidParameter
    ):
        logger.error(f"Invalid parameter provided: {exc.details}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail": exc.details},
        )

    @app.exception_handler(AIModelNotFound)
    async def ai_model_not_found_exception_handler(
        request: Request, exc: AIModelNotFound
    ):
        logger.error(f"AI Model '{exc.model_name}' not found")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail": f"Model '{exc.model_name}' not found"},
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unexpected error: {exc}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "INTERNAL SERVER ERROR"},
        )
