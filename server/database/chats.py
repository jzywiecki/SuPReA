class ChatsDAO:
    def __init__(self, mongo_client, db_name: str):
        db = mongo_client.get_database(db_name)
        self.collection = db.get_collection("chats")

    def save_chat(self, chat):
        return self.collection.insert_one(chat.dict(exclude={"id"}))
