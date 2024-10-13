"""
This module provides a class to generate a PDF document.
"""

import tempfile
import mermaid as mmd
import ray

from models import Project
from typing import List, Dict
from utils.fetch import fetch_image_task
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


class PDFGenerator:
    def __init__(self):
        """
        Initialize the PDF generator with default styles and elements.
        """
        self.styles = getSampleStyleSheet()
        self.title_style = self.styles["Heading2"]
        self.text_style = self.styles["BodyText"]
        self.pdf_elements = []

    def add_simple_text(self, title: str, text: str) -> None:
        """Adds a simple text section to the PDF."""
        self.pdf_elements.append(Paragraph(title, self.title_style))
        self.pdf_elements.append(Paragraph(text, self.text_style))
        self.pdf_elements.append(Spacer(1, 12))

    def add_simple_list(self, title: str, items: List[str]) -> None:
        """Adds a bulleted list to the PDF."""
        self.pdf_elements.append(Paragraph(title, self.title_style))
        items = [
            ListItem(Paragraph(f" {title}<br/>", self.styles["BodyText"]))
            for i, title in enumerate(items)
        ]
        self.pdf_elements.append(ListFlowable(items, bulletType="bullet"))
        self.pdf_elements.append(Spacer(1, 12))

    def add_er_diagram(self, er_diagram_format: str, title: str) -> None:
        """Adds an ER diagram to the PDF in Mermaid.js format."""
        self.pdf_elements.append(Paragraph(title, self.title_style))

        with tempfile.NamedTemporaryFile(suffix=".png", delete=True) as tmp:
            tmp_file_name = tmp.name

            graphe = Graph(tmp_file_name, er_diagram_format)
            mermaid = mmd.Mermaid(graphe)
            mermaid.to_png(tmp_file_name)

            with open(tmp_file_name, "rb") as f:
                image_data = f.read()

        image_stream = BytesIO(image_data)
        img = Image(image_stream)

        self.pdf_elements.append(img)
        self.pdf_elements.append(Spacer(1, 12))

    def add_two_elements_list(
        self, items: List[Dict[str, str]], title: str, name_one: str, name_two: str
    ) -> None:
        """Adds a list with two elements per item to the PDF."""
        self.pdf_elements.append(Paragraph(title, self.title_style))
        items = [
            ListItem(
                Paragraph(
                    f" <b>{element[name_one]}</b>: {element[name_two]}<br /><br />",
                    self.styles["BodyText"],
                )
            )
            for element in items
        ]
        self.pdf_elements.append(ListFlowable(items, bulletType="bullet"))
        self.pdf_elements.append(Spacer(1, 12))

    def add_three_element_list(
        self,
        items: List[Dict[str, str]],
        title: str,
        name_one: str,
        name_two: str,
        name_three: str,
    ) -> None:
        """Adds a list with three elements per item to the PDF."""
        self.pdf_elements.append(Paragraph(title, self.title_style))
        items = [
            ListItem(
                Paragraph(
                    f"{i + 1}. <b>{element[name_one]}</b><br /><br /><b>{name_two}</b>: {element[name_two]}<br /><br /><b>{name_three}</b>: {element[name_three]}<br /><br /><br />",
                    self.styles["BodyText"],
                )
            )
            for i, element in enumerate(items)
        ]
        self.pdf_elements.append(ListFlowable(items, bulletType="bullet"))
        self.pdf_elements.append(Spacer(1, 12))

    def add_pictures(self, title: str, pictures_urls: str) -> None:
        """Adds images to the PDF from a list of URLs."""
        actors_refs = []
        for picture_url in pictures_urls:
            actors_refs.append(fetch_image_task.remote(picture_url))
        pictures = ray.get(actors_refs)

        if any(picture is not None for picture in pictures):
            self.pdf_elements.append(Paragraph(title, self.title_style))
            for picture in pictures:
                if picture is not None:
                    self.pdf_elements.append(picture)
                    self.pdf_elements.append(Spacer(1, 12))
            self.pdf_elements.append(Spacer(1, 12))

    def add_project(self, project: Project) -> None:
        """
        Adds project details to the PDF elements.

        :param project: A dictionary containing various details about the project.
        """
        fields = [
            ("Name", project.get("name"), self.add_simple_text),
            ("For who", project.get("for_who"), self.add_simple_text),
            ("Doing what", project.get("doing_what"), self.add_simple_text),
            ("Additional info", project.get("additional_info"), self.add_simple_text),
            ("Description", project.get("description"), self.add_simple_text),
            (
                "Created at",
                project.get("created_at")
                and project["created_at"].strftime("%Y-%m-%d %H:%M:%S.%f"),
                self.add_simple_text,
            ),
            ("Titles", project.get("title", {}).get("names"), self.add_simple_list),
            (
                "Elevator speech",
                project.get("elevator_speech", {}).get("content"),
                self.add_simple_text,
            ),
            ("Motto", project.get("motto", {}).get("motto"), self.add_simple_text),
            (
                "Strategy",
                project.get("strategy", {}).get("strategy"),
                self.add_simple_text,
            ),
            (
                "Database Schema",
                create_er_diagram_mermaid(project.get("database_schema")),
                self.add_er_diagram,
            ),
            (
                "Actors",
                project.get("actors", {}).get("actors"),
                self.add_two_elements_list,
                "name",
                "description",
            ),
            (
                "Specifications",
                project.get("specifications", {}).get("specifications"),
                self.add_two_elements_list,
                "specification",
                "description",
            ),
            (
                "Risks",
                project.get("risks", {}).get("risks"),
                self.add_three_element_list,
                "risk",
                "description",
                "prevention",
            ),
            (
                "Functional Requirements",
                project.get("requirements", {}).get("functional_requirements"),
                self.add_three_element_list,
                "name",
                "description",
                "priority",
            ),
            (
                "Non Functional Requirements",
                project.get("requirements", {}).get("non_functional_requirements"),
                self.add_three_element_list,
                "name",
                "description",
                "priority",
            ),
            (
                "Project Schedule",
                project.get("project_schedule", {}).get("milestones"),
                self.add_three_element_list,
                "name",
                "description",
                "duration",
            ),
            (
                "Business Scenarios",
                project.get("business_scenarios", {})
                .get("business_scenario", {})
                .get("features"),
                self.add_two_elements_list,
                "feature_name",
                "description",
            ),
            ("Logos", project.get("logo", {}).get("logo_urls"), self.add_pictures),
        ]

        for field in fields:
            title, data, func = field[0], field[1], field[2]
            if data:
                if func in (
                    self.add_simple_text,
                    self.add_simple_list,
                    self.add_pictures,
                ):
                    func(title, data)
                elif func == self.add_er_diagram:
                    func(data, title)
                elif func == self.add_two_elements_list:
                    func(data, title, field[3], field[4])
                elif func == self.add_three_element_list:
                    func(data, title, field[3], field[4], field[5])

    def generate(self) -> bytes:
        """
        Generates the final PDF document based on added elements.

        :return: The generated PDF document as a byte stream.
        """
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=30,
            leftMargin=30,
            topMargin=30,
            bottomMargin=18,
        )
        doc.build(self.pdf_elements)
        buffer.seek(0)

        return buffer.getvalue()
