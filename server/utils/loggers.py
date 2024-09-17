import logging
import os
from logging.handlers import RotatingFileHandler


logger_ai = logging.getLogger("AI")
logger_db = logging.getLogger("DB")
logger = logging.getLogger("LOGGER")


def configure_logging(
    logger_arg, level, file_name: str, formatter, max_bytes: int, backup_count: int
) -> None:
    """
    Configures a logger with a rotating file handler.

    :param logger_arg: The logger instance to configure.
    :param level: The logging level (e.g., logging.INFO, logging.ERROR).
    :param file_name: The base name of the log file.
    :param formatter: The log formatter to format log messages.
    :param max_bytes: The maximum size of the log file in bytes before rotation.
    :param backup_count: The number of backup log files to keep.
    """
    logger_arg.setLevel(level)
    log_file = f"{file_name}.log"
    file_handler = RotatingFileHandler(
        log_file,
        mode="w",
        maxBytes=max_bytes,
        backupCount=backup_count,
        encoding="utf-8",
    )
    file_handler.setFormatter(formatter)
    logger_arg.addHandler(file_handler)


def enable_file_logging() -> None:
    """
    Enables file logging for all configured loggers.
    """
    ai_logger_formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(funcName)s - [AI Model: %(ai_model)s] - [Component: %(component)s] - %(message)s"
    )
    configure_logging(logger_ai, logging.INFO, "log_ai", ai_logger_formatter, 1024, 0)

    database_logger_formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(funcName)s - [ProjectId: %(project_id)s] - [Field: %(field)s] - %(message)s"
    )
    configure_logging(
        logger_db, logging.INFO, "log_db", database_logger_formatter, 1024, 0
    )

    classic_logger_formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(funcName)s - %(message)s"
    )
    configure_logging(logger, logging.INFO, "log", classic_logger_formatter, 2048, 0)


def disable_logging() -> None:
    """
    Disables file logging by removing all file handlers from the loggers.
    """
    loggers = [logger_ai, logger_db, logger]
    for log in loggers:
        for handler in log.handlers[:]:
            if isinstance(handler, RotatingFileHandler):
                log.removeHandler(handler)


if os.getenv("VISIO_LOG") == "FILE":
    enable_file_logging()
else:
    disable_logging()
