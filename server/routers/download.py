from bson.errors import InvalidId
from fastapi import APIRouter, Response, HTTPException, status
from utils.pdf import generate_pdf
import database.projects as projects_dao

router = APIRouter(
    tags=["download"],
    prefix="/download",
)


@router.get("/pdf/{project_id}")
def download_pdf(project_id: str):
    try:
        project = projects_dao.get_project(project_id)

        if project is None:
            return Response(status_code=status.HTTP_404_NOT_FOUND)

        pdf_buffer = generate_pdf(project)

        headers = {
            "Content-Disposition": f'attachment; filename="{project["name"]}.pdf"',
            "Content-Type": "application/pdf",
        }

        return Response(content=pdf_buffer, headers=headers, media_type="application/pdf")
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project id")
    except Exception as e:
        # TODO log error
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="INTERNAL SERVER ERROR")
