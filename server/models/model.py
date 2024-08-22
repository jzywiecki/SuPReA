import json

from pydantic import BaseModel
from typing_extensions import Annotated
from pydantic.functional_validators import BeforeValidator
from bson import ObjectId

from modules.module import Module
from database import project_collection as collection
from ai.ai import AI

PyObjectId = Annotated[str, BeforeValidator(str)]

def generate_model(module_class: type[Module], for_who: str, doing_what: str, additional_info: str,
                   model_class: type[BaseModel], model_ai: type[AI]):
    ai = model_ai()
    module = module_class(ai)
    content = module.get_content(for_who, doing_what, additional_info, False)
    data = json.loads(content)
    result = model_class(**data)

    return result


def save_model_to_database(project_id: str, field_name: str, model):
    collection.update_one(
        {"_id": ObjectId(project_id)},
        {"$set": {field_name: model.dict()}}
    )
