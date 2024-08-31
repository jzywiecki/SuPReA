from bson import ObjectId


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

    def create_project(self, project):
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
