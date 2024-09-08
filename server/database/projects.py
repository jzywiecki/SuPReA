"""
This module serves as a global Data Access Object (DAO) for performing operations on the project-related
collections in the MongoDB database. It provides a wrapper around the MongoDB operations for projects.
"""

from bson import ObjectId
from datetime import datetime

from models import Project
from .database import projects_collection as collection

import database.chats as chats_dao


def get_project(project_id: str):
    """
    :param str project_id: The id of the project to retrieve.
    :return: The project with the specified id.
    :rtype: dict
    """
    return collection.find_one({"_id": ObjectId(project_id)})


def get_projects_by_owner(owner_id: str):
    """
    Returns the projects where the specified user is the owner.

    :param str owner_id: The id of the owner of the projects to retrieve.
    :return: The projects where the specified user is the owner with only id, name, owner, and description.
    :rtype: list of dict
    """
    return list(
        collection.find(
            {"owner": ObjectId(owner_id)},
            {"_id": 1, "name": 1, "description": 1, "owner": 1},
        )
    )


def get_projects_by_member(member_id: str):
    """
    Returns the projects where the specified user is a member (but not owner).

    :param str member_id: The id of the member of the projects to retrieve.
    :return: The projects where the specified user is a member (but not owner) with only id, name, owner, and description.
    :rtype: list of dict
    """
    return list(
        collection.find(
            {"members": ObjectId(member_id), "owner": {"$ne": ObjectId(member_id)}},
            {"_id": 1, "name": 1, "description": 1, "owner": 1},
        )
    )


def get_projects_by_member_or_owner(user_id: str):
    """
    Returns the projects where the specified user is either the owner or a member.

    :param str user_id: The id of the user to retrieve projects for.
    :return: The projects where the specified user is either the owner or a member with only id, name, owner, and description.
    :rtype: list of dict
    """
    return list(
        collection.find(
            {"$or": [{"owner": ObjectId(user_id)}, {"members": ObjectId(user_id)}]},
            {"_id": 1, "name": 1, "description": 1, "owner": 1},
        )
    )


def get_project_component(project_id: str, component_name: str):
    """
    Returns a specific component of a project. (e.g. actors, business_scenarios)

    :param str project_id: The id of the project.
    :param str component_name: The name of the component to retrieve.
    :return: The component of the project with the specified name.
    :rtype: dict
    """
    project = get_project(project_id)
    if project and component_name in project:
        return project[component_name]
    else:
        return None


def update_project_component(project_id: str, component_name: str, component):
    """
    Saves a specific component of a project. (e.g. actors, business_scenarios)

    :param str project_id: The id of the project.
    :param str component_name: The name of the component to save.
    :param component: The component to save.
    :return: The result of the mongodb update operation.
    """
    return collection.update_one(
        {"_id": ObjectId(project_id)}, {"$set": {component_name: component.dict()}}
    )


def save_project(project: Project):
    """
    Saves a project to the database.

    :param Project project: The project to save.
    :return: The result of the mongodb insert operation.
    """
    return collection.insert_one(project.dict(exclude={"id"}))


def update_project(project_id: str, project: Project):
    """
    Updates a project with the specified id.

    :param str project_id: The id of the project to update.
    :param Project project: The updated project.
    :return: The result of the mongodb update operation.
    """
    return collection.update_one(
        {"_id": ObjectId(project_id)}, {"$set": project.dict(exclude={"id"})}
    )


# TODO: below method should be a transaction.
def delete_project(project_id: str):
    """
    Deletes a project and its associated chats.

    :param str project_id: The id of the project to delete.
    :return: The result of the mongodb delete operation.
    """
    project = get_project(project_id)
    if project is None:
        return None
    chat_id = str(project["chat_id"])
    ai_chat_id = str(project["ai_chat_id"])

    chats_dao.delete_chat(chat_id)
    chats_dao.delete_chat(ai_chat_id)
    return collection.delete_one({"_id": ObjectId(project_id)})


# TODO: below method should be a transaction.
def create_project(
    project_name: str,
    owner_id: str,
    description: str,
    for_who: str,
    doing_what: str,
    additional_info: str,
):
    """
    Creates new empty project with the specified details and returns the project id.
    Also creates two chats for the project: discussion_chat and ai_chat.

    :param str project_name: The name of the project.
    :param str owner_id: The id of the owner of the project.
    :param str description: The description of the project.
    :param str for_who: The intended recipient of the application.
    :param str doing_what: The purpose of the application.
    :param str additional_info: Additional information about the application.

    :return: The id of the newly created project.
    :rtype: str
    """

    discussion_chat_id = chats_dao.create_chat()
    ai_chat_id = chats_dao.create_chat()

    new_project = Project(
        name=project_name,
        for_who=for_who,
        doing_what=doing_what,
        additional_info=additional_info,
        description=description,
        owner=ObjectId(owner_id),
        members=[ObjectId(owner_id)],
        created_at=datetime.now(),
        chat_id=ObjectId(discussion_chat_id),
        ai_chat_id=ObjectId(ai_chat_id),
    )

    result = save_project(new_project)
    return str(result.inserted_id)


def is_project_exist(project_id: str):
    """
    Checks if a project with the specified id exists.

    :param str project_id: The id of the project to check.
    :return: True if the project exists, False otherwise.
    :rtype: bool
    """
    return collection.count_documents({"_id": ObjectId(project_id)}) > 0
