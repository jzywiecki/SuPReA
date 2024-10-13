from ray import ObjectRef

from .open_ai import dall_e_2_remote_ref
from .open_ai import dall_e_3_remote_ref
from .open_ai import gpt_35_turbo_remote_ref
from .open_ai import gpt_4o_mini_remote_ref

from utils import AIModelNotFound


def get_model_remote_ref_enum(model_name: str) -> ObjectRef:
    """Get the model enum from the model name."""
    if model_name == "gpt-35-turbo":
        return gpt_35_turbo_remote_ref
    if model_name == "gpt-4o-mini":
        return gpt_4o_mini_remote_ref
    if model_name == "dall-e-3":
        return dall_e_3_remote_ref
    if model_name == "dall-e-2":
        return dall_e_2_remote_ref
    raise AIModelNotFound(model_name)


def get_image_model_remote_ref_enum(model_name: str) -> ObjectRef:
    """Get the image model ref enum from the model name."""
    if model_name == "dall-e-3":
        return dall_e_3_remote_ref
    if model_name == "dall-e-2":
        return dall_e_2_remote_ref
    raise AIModelNotFound(model_name)


def get_text_model_remote_ref_enum(model_name: str) -> ObjectRef:
    """Get the text model ref enum from the model name."""
    if model_name == "gpt-35-turbo":
        return gpt_35_turbo_remote_ref
    if model_name == "gpt-4o-mini":
        return gpt_4o_mini_remote_ref
    raise AIModelNotFound(model_name)
