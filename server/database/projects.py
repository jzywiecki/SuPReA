from bson import ObjectId
from datetime import datetime

from models import Chat, Project
from .database import chats_dao


class ProjectsDAO:
    def __init__(self, mongo_client, db_name: str):
        db = mongo_client.get_database(db_name)
        self.collection = db.get_collection("projects")

    def get_project(self, project_id: str):
        return self.collection.find_one({"_id": ObjectId(project_id)})

    def get_projects_by_owner(self, owner_id: str):
        """Returns projects where the specified user is the owner with only id, name, and description."""
        return list(self.collection.find(
            {"owner": ObjectId(owner_id)},
            {"_id": 1, "name": 1, "description": 1}
        ))

    def get_projects_by_member(self, member_id: str):
        """Returns projects where the specified user is a member but not the owner with only id, name,
        and description."""
        return list(self.collection.find(
            {
                "members": ObjectId(member_id),
                "owner": {"$ne": ObjectId(member_id)}
            },
            {"_id": 1, "name": 1, "description": 1}
        ))

    def get_projects_by_member_or_owner(self, user_id: str):
        """Returns projects where the specified user is a member or the owner with only id, name, and description."""
        return list(self.collection.find(
            {
                "$or": [
                    {"owner": ObjectId(user_id)},
                    {"members": ObjectId(user_id)}
                ]
            },
            {"_id": 1, "name": 1, "description": 1}
        ))

    def get_project_component(self, project_id: str, component_name: str):
        """Returns a specific component of a project. (e.g. actors, business_scenarios)"""
        project = self.get_project(project_id)
        if project and component_name in project:
            return project[component_name]
        else:
            return None

    def update_project_component(self, project_id: str, component_name: str, component):
        """Saves a specific component of a project. (e.g. actors, business_scenarios)"""
        return self.collection.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": {component_name: component.dict()}}
        )

    def save_project(self, project):
        """Saves a project."""
        return self.collection.insert_one(project.dict(exclude={"id"}))

    def update_project(self, project_id: str, project):
        """Updates a project."""
        return self.collection.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": project.dict(exclude={"id"})}
        )

    def delete_project(self, project_id: str):
        """Deletes a project."""
        return self.collection.delete_one({"_id": ObjectId(project_id)})

    # TODO: below method should be a transaction.
    def create_empty_project(
            self, project_name, owner_id, description: str, for_who: str, doing_what: str, additional_info: str
    ):
        """Creates new empty project with the specified details and returns the project id.
        Also creates two chats for the project: discussion_chat and ai_chat."""

        discussion_chat = Chat(last_message_id=0, messages=[])
        ai_chat = Chat(last_message_id=0, messages=[])

        discussion_chat_id = chats_dao.save_chat(discussion_chat).inserted_id
        ai_chat_id = chats_dao.save_chat(ai_chat).inserted_id

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

        result = self.save_project(new_project)
        return str(result.inserted_id)
