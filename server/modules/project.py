async def create_project(
    project_name, owner_id, for_who: str, doing_what: str, additional_info: str
):
    discussion_chat = Chat(last_message_id=0, messages=[])

    ai_chat = Chat(last_message_id=0, messages=[])

    discussion_chat_id = await chats_collection.insert_one(
        discussion_chat.model_dump(by_alias=True, exclude=["id"])
    )

    ai_chat = await chats_collection.insert_one(
        ai_chat.model_dump(by_alias=True, exclude=["id"])
    )

    new_project = ProjectModel(
        name=project_name,
        for_who=for_who,
        doing_what=doing_what,
        additional_info=additional_info,
        owner=ObjectId(owner_id),
        members=[ObjectId(owner_id)],
        description="",
        created_at=datetime.now(),
        chat_id=ObjectId(discussion_chat_id.inserted_id),
        ai_chat_id=ObjectId(ai_chat.inserted_id),
    )

    result = await project_collection.insert_one(
        new_project.model_dump(by_alias=True, exclude=["id"])
    )

    return str(result.inserted_id)