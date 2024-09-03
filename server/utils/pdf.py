import tempfile
import mermaid as mmd
import ray

from utils.fetch import fetch_image_remote
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Image,
    ListFlowable,
    ListItem,
)
from mermaid.graph import Graph
from utils.mermaid_tools import create_er_diagram_mermaid
from io import BytesIO


styles = getSampleStyleSheet()
title_style = styles["Heading2"]
text_style = styles["BodyText"]


def add_simple_text(pdf_elements, title, text):
    pdf_elements.append(Paragraph(title, title_style))
    pdf_elements.append(Paragraph(text, text_style))
    pdf_elements.append(Spacer(1, 12))


def add_simple_list(pdf_elements, title, modules):
    pdf_elements.append(Paragraph(title, title_style))

    items = [
        ListItem(Paragraph(f" {title}<br/>", styles["BodyText"]))
        for i, title in enumerate(modules)
    ]
    pdf_elements.append(ListFlowable(items, bulletType="bullet"))

    pdf_elements.append(Spacer(1, 12))


def add_er_diagram(pdf_elements, er_diagram_format, title):
    pdf_elements.append(Paragraph(title, title_style))

    with tempfile.NamedTemporaryFile(suffix=".png", delete=True) as tmp:
        tmp_file_name = tmp.name

        graphe = Graph(tmp_file_name, er_diagram_format)
        mermaid = mmd.Mermaid(graphe)
        mermaid.to_png(tmp_file_name)

        with open(tmp_file_name, "rb") as f:
            image_data = f.read()

    image_stream = BytesIO(image_data)
    img = Image(image_stream)

    pdf_elements.append(img)
    pdf_elements.append(Spacer(1, 12))


def add_two_elements_list(pdf_elements, actors, title, name_one, name_two):
    pdf_elements.append(Paragraph(title, title_style))

    items = [
        ListItem(
            Paragraph(
                f" <b>{element[name_one]}</b>: {element[name_two]}<br /><br />",
                styles["BodyText"],
            )
        )
        for i, element in enumerate(actors)
    ]
    pdf_elements.append(ListFlowable(items, bulletType="bullet"))

    pdf_elements.append(Spacer(1, 12))


def add_three_element_list(pdf_elements, module, title, name_one, name_two, name_three):
    pdf_elements.append(Paragraph(title, title_style))

    items = [
        ListItem(
            Paragraph(
                f"{i + 1}. <b>{element[name_one]}</b><br /><br /><b>{name_two}</b>: {element[name_two]}<br /><br /><b>{name_three}</b>: {element[name_three]}<br /><br /><br />",
                styles["BodyText"],
            )
        )
        for i, element in enumerate(module)
    ]
    pdf_elements.append(ListFlowable(items, bulletType="bullet"))

    pdf_elements.append(Spacer(1, 12))


def add_pictures(pdf_elements, title, pictures_urls):
    actors_refs = []
    for picture_url in pictures_urls:
        actors_refs.append(fetch_image_remote.remote(picture_url))
    pictures = ray.get(actors_refs)

    if any(picture is not None for picture in pictures):
        pdf_elements.append(Paragraph(title, title_style))
        for picture in pictures:
            if picture is not None:
                pdf_elements.append(picture)
                pdf_elements.append(Spacer(1, 12))
        pdf_elements.append(Spacer(1, 12))


def generate_pdf(project):
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=30,
        leftMargin=30,
        topMargin=30,
        bottomMargin=18,
    )
    pdf_elements = []

    fields = [
        ("Name", project.get("name"), add_simple_text),
        ("For who", project.get("for_who"), add_simple_text),
        ("Doing what", project.get("doing_what"), add_simple_text),
        ("Additional info", project.get("additional_info"), add_simple_text),
        ("Description", project.get("description"), add_simple_text),
        ("Created at", project.get("created_at") and project["created_at"].strftime("%Y-%m-%d %H:%M:%S.%f"), add_simple_text),
        ("Titles", project.get("title", {}).get("names"), add_simple_list),
        ("Elevator speech", project.get("elevator_speech", {}).get("content"), add_simple_text),
        ("Motto", project.get("motto", {}).get("motto"), add_simple_text),
        ("Strategy", project.get("strategy", {}).get("strategy"), add_simple_text),
        ("Database Schema", create_er_diagram_mermaid(project.get("database_schema")), add_er_diagram),
        ("Actors", project.get("actors", {}).get("actors"), add_two_elements_list, "name", "description"),
        ("Specifications", project.get("specifications", {}).get("specifications"), add_two_elements_list, "specification", "description"),
        ("Risks", project.get("risks", {}).get("risks"), add_three_element_list, "risk", "description", "prevention"),
        ("Functional Requirements", project.get("requirements", {}).get("functional_requirements"), add_three_element_list, "name", "description", "priority"),
        ("Non Functional Requirements", project.get("requirements", {}).get("non_functional_requirements"), add_three_element_list, "name", "description", "priority"),
        ("Project Schedule", project.get("project_schedule", {}).get("milestones"), add_three_element_list, "name", "description", "duration"),
        ("Business Scenarios", project.get("business_scenarios", {}).get("business_scenario", {}).get("features"), add_two_elements_list, "feature_name", "description"),
        ("Logos", project.get("logo", {}).get("logo_urls"), add_pictures),
    ]

    for field in fields:
        title, data, func = field[0], field[1], field[2]
        if data:
            if func is add_simple_text or func is add_simple_list or func is add_pictures:
                func(pdf_elements, title, data)
            elif func is add_er_diagram:
                func(pdf_elements, data, title)
            elif func is add_two_elements_list:
                func(pdf_elements, data, title, field[3], field[4])
            elif func is add_three_element_list:
                func(pdf_elements, data, title, field[3], field[4], field[5])

    doc.build(pdf_elements)
    buffer.seek(0)

    return buffer.getvalue()
