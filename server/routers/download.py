from fastapi import APIRouter, Response, HTTPException
from utils.pdf import generate_pdf
import database.projects as projects_dao

router = APIRouter(
    tags=["download"],
    prefix="/download",
    responses={404: {"description": "Not found"}},
)


@router.get("/pdf/{project_id}")
def download_pdf(project_id: str):
    try:
        project = projects_dao.get_project(project_id)

        if project is None:
            return HTTPException(status_code=404, detail=f"Project {project_id} not found")

        pdf_buffer = generate_pdf(project)

        headers = {
            "Content-Disposition": f'attachment; filename="{project["name"]}.pdf"',
            "Content-Type": "application/pdf",
        }

        return Response(content=pdf_buffer, headers=headers, media_type="application/pdf")
    except Exception as e:
        print(f"Exception: {e}")
        raise HTTPException(status_code=500, detail="INTERNAL SERVER ERROR")
