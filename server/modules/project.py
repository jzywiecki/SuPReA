from datetime import datetime
from models import Chat, Project
from bson import ObjectId
from database import chats_dao, projects_dao


def create_empty_project(
        project_name, owner_id, description: str, for_who: str, doing_what: str, additional_info: str
):
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

    result = projects_dao.save_project(new_project)

    return str(result.inserted_id)
