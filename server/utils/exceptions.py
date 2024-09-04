from fastapi import HTTPException, Request, FastAPI, status
from fastapi.responses import JSONResponse
from utils import logger
from bson.errors import InvalidId


class WrongFormatGeneratedByAI(Exception):
    pass


class ProjectNotFound(Exception):
    def __init__(self, project_id: str):
        self.project_id = project_id
        super().__init__(f"Project with id: '{project_id}' not found")


class ModelNotFound(Exception):
    def __init__(self, project_id: str, model_name: str):
        self.model_name = model_name
        self.project_id = project_id
        super().__init__(f"{model_name}' not found in project: '{project_id}'")


class InvalidParameter(Exception):
    def __init__(self, details: str):
        super().__init__(details)
        self.details = details


def register_fastapi_exception_handlers(app: FastAPI):
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

    @app.exception_handler(ModelNotFound)
    async def model_not_found_exception_handler(request: Request, exc: ModelNotFound):
        logger.error(f"{exc.model_name} not found in project: {exc.project_id}")
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "detail": f"{exc.model_name} not found in project: {exc.project_id}"
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

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unexpected error: {exc}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "INTERNAL SERVER ERROR"},
        )
