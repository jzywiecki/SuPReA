from pydantic import BaseModel
from typing_extensions import Annotated
from pydantic.functional_validators import BeforeValidator
from bson import ObjectId

from server.utils.openaiUtils import Model
from server.modules.module import Module

PyObjectId = Annotated[str, BeforeValidator(str)]


def generate_model(module_class : Module, for_who : str, doing_what : str, additional_info : str, model_class : BaseModel):
    result = None

    try:
        module = module_class(Model.GPT3)
        content = module.get_content(for_who, doing_what, additional_info, False)
        data = json.loads(content.choices[0].message.content)
        result = model_class(**data)
    
    except Exception as e:
        print(f"Error occurred while generating model.")
        print(f"details: {e}")

    return result


def save_model_to_database(project_id: str, collection, field_name : str, model):
    try:
        result = collection.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": {field_name: model.dict()}}
        )
        if result.matched_count == 0:
            raise Exception("Project not found.")
        
    except Exception as e:
        print(f"Error occurred while saving model to the database.")
        print(f"details: {e}")
        return False

    return True




