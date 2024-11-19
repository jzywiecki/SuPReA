"""
This module provides services to generate a project resources for specific project.
"""

from database import project_dao
from database import picture_dao
from database import users_dao
from utils import ProjectNotFound, PDFGenerator
from utils import PictureNotFound
from models import Picture
from utils import InvalidParameter
from utils import UserNotFound


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


async def update_avatar(user_id: str, file):
    """
    Saves the provided picture to the database.
    """
    if not file.content_type.startswith("image/"):
        print("HERE ERROR")
        raise InvalidParameter("Invalid file format. Only images are allowed.")

    file_data = await file.read()

    picture = Picture(data=file_data)

    if not users_dao.is_user_exist(user_id):
        raise UserNotFound(str(user_id))

    # TODO: Picture validation

    previous_picture_id = users_dao.get_avatar_id(user_id)

    if previous_picture_id:
        picture_dao.delete_picture(previous_picture_id)

    picture_id = picture_dao.save_picture(picture)

    picture_url = f"http://localhost:8000/resources/picture/{picture_id}"

    print("HER")
    print(picture_url)
    print(user_id)
    users_dao.set_new_avatar(user_id, picture_id, picture_url)

    return picture_url


def removed_avatar(user_id: str):
    """
    Deletes the avatar of the user.
    """
    if not users_dao.is_user_exist(user_id):
        raise UserNotFound(str(user_id))

    previous_picture_id = users_dao.get_avatar_id(user_id)

    if previous_picture_id:
        picture_dao.delete_picture(previous_picture_id)

    users_dao.set_new_avatar(user_id, None, None)
