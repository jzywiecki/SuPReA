from fastapi import APIRouter, Response, status
from services import generate_pdf_for_project

router = APIRouter(
    tags=["download"],
    prefix="/download",
)


@router.get(
    "/pdf/{project_id}",
    status_code=status.HTTP_200_OK,
)
def download_pdf(project_id: str):
    pdf, name = generate_pdf_for_project(project_id)

    headers = {
        "Content-Disposition": f'attachment; filename="{name}.pdf"',
        "Content-Type": "application/pdf",
    }

    return Response(
        content=pdf, headers=headers, media_type="application/pdf"
    )
