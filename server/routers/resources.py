from fastapi import APIRouter, Response, status
from services import get_picture

router = APIRouter(
    tags=["resources"],
    prefix="/resources",
)


@router.get(
    "/picture/{picture_id}",
    status_code=status.HTTP_200_OK,
)
def fetch_picture(picture_id: str):
    """
    Fetch a picture representation of the specified project.

    :param str picture_id: The unique identifier of the picture.
    """
    picture = get_picture(picture_id)

    headers = {
        "Content-Disposition": f'inline; filename="{picture.id}.png"',
        "Content-Type": "image/jpeg",
    }

    return Response(content=picture.data, headers=headers, media_type="image/jpeg")
