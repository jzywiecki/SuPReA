from fastapi import APIRouter, Response, status, UploadFile, File, Path
from services import get_picture, update_avatar, removed_avatar

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


@router.post(
    "/upload-avatar/{user_id}",
    status_code=status.HTTP_201_CREATED,
)
async def upload_avatar(
    user_id: str = Path(..., description="The ID of the user for whom the avatar is being uploaded"),
    file: UploadFile = File(...)
):
    return await update_avatar(user_id, file)


@router.delete(
    "/delete-avatar/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_avatar(user_id: str):
    return removed_avatar(user_id)
