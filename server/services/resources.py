"""
This module provides services to generate a project resources for specific project.
"""

from database import project_dao
from database import picture_dao
from utils import ProjectNotFound, PDFGenerator
from utils import PictureNotFound
from models import Picture


def generate_pdf_for_project(project_id: str):
    """
    Retrieves the project from the database using the provided project ID and generates a PDF document.

    :param int project_id: The unique identifier of the project.

    :raises ProjectNotFound: If no project is found with the provided ID.

    :return: A tuple containing:
        - pdf_buffer (bytes): The generated PDF document in a binary format.
        - project_name (str): The name of the project or "unknown" if the name is not available.
    :rtype: tuple
    """
    project = project_dao.get_project(project_id)

    if project is None:
        raise ProjectNotFound(project_id)

    pdf_generator = PDFGenerator()
    pdf_generator.add_project(project)

    return pdf_generator.generate(), project.get("name", "unknown")


def get_picture(picture_id: str):
    """
    Retrieves the picture from the database using the provided picture ID.
    """
    picture = picture_dao.get_picture(picture_id)
    if picture is None:
        raise PictureNotFound(picture_id)

    return Picture(**picture)
