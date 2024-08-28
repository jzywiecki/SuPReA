from fastapi import APIRouter, Response, HTTPException
from utils.pdf import generate_pdf
from database import get_project


router = APIRouter(
    tags=["download"],
    prefix="/download",
    responses={404: {"description": "Not found"}},
)


@router.get("/pdf/{project_id}")
async def download_pdf(project_id: str):
    project = await get_project(project_id)

    if project is None:
        return HTTPException(status_code=404, detail=f"Project {project_id} not found")

    pdf_buffer = generate_pdf(project)

    headers = {
        "Content-Disposition": f'attachment; filename="{project["name"]}.pdf"',
        "Content-Type": "application/pdf",
    }

    return Response(content=pdf_buffer, headers=headers, media_type="application/pdf")
