from bson import ObjectId
from datetime import datetime

from models import Project
from .database import projects_collection as collection

import database.chats as chats_dao


def get_project(project_id: str):
    return collection.find_one({"_id": ObjectId(project_id)})


def get_projects_by_owner(owner_id: str):
    """Returns projects where the specified user is the owner with only id, name, and description."""
    return list(
        collection.find(
            {"owner": ObjectId(owner_id)}, {"_id": 1, "name": 1, "description": 1}
        )
    )


def get_projects_by_member(member_id: str):
    """Returns projects where the specified user is a member but not the owner with only id, name,
    and description."""
    return list(
        collection.find(
            {"members": ObjectId(member_id), "owner": {"$ne": ObjectId(member_id)}},
            {"_id": 1, "name": 1, "description": 1},
        )
    )


def get_projects_by_member_or_owner(user_id: str):
    """Returns projects where the specified user is a member or the owner with only id, name, and description."""
    return list(
        collection.find(
            {"$or": [{"owner": ObjectId(user_id)}, {"members": ObjectId(user_id)}]},
            {"_id": 1, "name": 1, "description": 1},
        )
    )


def get_project_component(project_id: str, component_name: str):
    """Returns a specific component of a project. (e.g. actors, business_scenarios)"""
    project = get_project(project_id)
    if project and component_name in project:
        return project[component_name]
    else:
        return None


def update_project_component(project_id: str, component_name: str, component):
    """Saves a specific component of a project. (e.g. actors, business_scenarios)"""
    return collection.update_one(
        {"_id": ObjectId(project_id)}, {"$set": {component_name: component.dict()}}
    )


def save_project(project):
    """Saves a project."""
    return collection.insert_one(project.dict(exclude={"id"}))


def update_project(self, project_id: str, project):
    """Updates a project."""
    return self.collection.update_one(
        {"_id": ObjectId(project_id)}, {"$set": project.dict(exclude={"id"})}
    )


# TODO: below method should be a transaction.
def delete_project(project_id: str):
    """Deletes a project."""
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
    project_name,
    owner_id,
    description: str,
    for_who: str,
    doing_what: str,
    additional_info: str,
):
    """Creates new empty project with the specified details and returns the project id.
    Also creates two chats for the project: discussion_chat and ai_chat."""

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
    return collection.count_documents({"_id": ObjectId(project_id)}) > 0
