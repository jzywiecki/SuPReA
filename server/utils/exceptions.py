from fastapi import HTTPException, Request, FastAPI
from fastapi.responses import JSONResponse
from utils import logger
from bson.errors import InvalidId


class WrongFormatGeneratedByAI(Exception):
    pass


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
            status_code=400,
            content={"detail": "Invalid ID provided"},
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unexpected error: {exc}")
        return JSONResponse(
            status_code=500,
            content={"detail": "INTERNAL SERVER ERROR"},
        )
