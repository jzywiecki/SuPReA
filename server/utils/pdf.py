import tempfile
import mermaid as mmd

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
from utils.mermaid_tools import parse_database_to_erdiagram_mermaid
from io import BytesIO


styles = getSampleStyleSheet()
title_style = styles["Heading2"]
text_style = styles["BodyText"]


def add_simple_text(pdf_elements, title, text):
    pdf_elements.append(Paragraph(title, title_style))
    pdf_elements.append(Paragraph(text, text_style))
    pdf_elements.append(Spacer(1, 12))


def add_simple_list(pdf_elements, modules, title):
    pdf_elements.append(Paragraph(title, title_style))

    items = [
        ListItem(Paragraph(f" {title}<br/>", styles["BodyText"]))
        for i, title in enumerate(modules)
    ]
    pdf_elements.append(ListFlowable(items, bulletType="bullet"))

    pdf_elements.append(Spacer(1, 12))


def add_er_diagram(pdf_elements, er_diagram_format, tmp_file_name, title):
    pdf_elements.append(Paragraph(title, title_style))

    graphe = Graph(tmp_file_name, er_diagram_format)
    mermaid = mmd.Mermaid(graphe)
    mermaid.to_png(tmp_file_name)
    img = Image(tmp_file_name)
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

    add_simple_text(pdf_elements, "Name", project["name"])

    with tempfile.NamedTemporaryFile(suffix=".png", delete=True) as tmp:
        if project["for_who"]:
            add_simple_text(pdf_elements, "For who", project["for_who"])

        if project["doing_what"]:
            add_simple_text(pdf_elements, "Doing what", project["doing_what"])

        if project["additional_info"]:
            add_simple_text(pdf_elements, "Additional info", project["additional_info"])

        if project["description"]:
            add_simple_text(pdf_elements, "Description", project["description"])

        if project["created_at"]:
            add_simple_text(
                pdf_elements,
                "Created at",
                project["created_at"].strftime("%Y-%m-%d %H:%M:%S.%f"),
            )

        if project["title"]:
            add_simple_list(pdf_elements, project["title"]["names"], "Titles")

        if project["elevator_speech"]:
            add_simple_text(
                pdf_elements, "Elevator speech", project["elevator_speech"]["content"]
            )

        if project["motto"]:
            add_simple_text(pdf_elements, "Motto", project["motto"]["motto"])

        if project["strategy"]:
            add_simple_text(pdf_elements, "Strategy", project["strategy"]["strategy"])

        if project["database_schema"]:
            add_er_diagram(
                pdf_elements,
                parse_database_to_erdiagram_mermaid(project["database_schema"]),
                tmp.name,
                "Database Schema",
            )

        if project["actors"]:
            add_two_elements_list(
                pdf_elements,
                project["actors"]["actors"],
                "Actors",
                "name",
                "description",
            )

        if project["specifications"]:
            add_two_elements_list(
                pdf_elements,
                project["specifications"]["specifications"],
                "Specifications",
                "name",
                "description",
            )

        if project["risks"]:
            add_three_element_list(
                pdf_elements,
                project["risks"]["risks"],
                "Risks",
                "risk",
                "description",
                "prevention",
            )

        if (
            project["requirements"]
            and project["requirements"]["functional_requirements"]
        ):
            add_three_element_list(
                pdf_elements,
                project["requirements"]["functional_requirements"],
                "Functional Requirements",
                "name",
                "description",
                "priority",
            )

        if (
            project["requirements"]
            and project["requirements"]["non_functional_requirements"]
        ):
            add_three_element_list(
                pdf_elements,
                project["requirements"]["non_functional_requirements"],
                "Non Functional Requirements",
                "name",
                "description",
                "priority",
            )

        if project["project_schedule"]:
            add_three_element_list(
                pdf_elements,
                project["project_schedule"]["milestones"],
                "Project Schedule",
                "name",
                "description",
                "duration",
            )

        if project["business_scenarios"]:
            add_two_elements_list(
                pdf_elements,
                project["business_scenarios"]["business_scenario"]["features"],
                "Business Scenarios",
                "feature_name",
                "description",
            )

        if project["logo"]:
            add_simple_list(pdf_elements, project["logo"]["logo_urls"], "Logos")

        # TODO: UMLs!

        doc.build(pdf_elements)
        buffer.seek(0)

    return buffer.getvalue()
