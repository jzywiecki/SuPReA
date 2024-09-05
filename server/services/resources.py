import database.projects as projects_dao
from utils import ProjectNotFound, generate_pdf


def generate_pdf_for_project(project_id):
    project = projects_dao.get_project(project_id)

    if project is None:
        raise ProjectNotFound(project_id)

    pdf_buffer = generate_pdf(project)
    return pdf_buffer, project.get("name", "unknown")
