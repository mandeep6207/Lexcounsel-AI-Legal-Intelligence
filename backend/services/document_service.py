from __future__ import annotations

from io import BytesIO
from typing import Literal

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

DocumentType = Literal["fir", "complaint"]


class LegalDocumentService:
    def build_text(self, document_type: DocumentType, name: str, incident: str, location: str, date: str) -> str:
        if document_type == "fir":
            return (
                f"FIR Draft\n\nTo,\nThe Station House Officer\n\nSubject: Request to register FIR\n\n"
                f"Respected Sir/Madam,\n\nI, {name}, wish to report the following incident that occurred on {date} at {location}. "
                f"Incident details: {incident}.\n\n"
                "I request you to kindly register an FIR and take appropriate legal action.\n\n"
                "Sincerely,\n"
                f"{name}"
            )

        return (
            f"Complaint Letter\n\nTo,\nThe Concerned Authority\n\nSubject: Complaint regarding incident\n\n"
            f"Respected Sir/Madam,\n\nMy name is {name}. I am writing to file a complaint regarding an incident on {date} at {location}. "
            f"Details: {incident}.\n\nI request your immediate attention and necessary action.\n\n"
            "Regards,\n"
            f"{name}"
        )

    def build_pdf(self, text: str) -> bytes:
        buffer = BytesIO()
        document = SimpleDocTemplate(buffer, pagesize=A4, leftMargin=0.8 * inch, rightMargin=0.8 * inch)
        styles = getSampleStyleSheet()
        body_style = ParagraphStyle(
            "Body",
            parent=styles["BodyText"],
            alignment=TA_LEFT,
            leading=15,
            spaceAfter=8,
        )
        story = []
        for block in text.split("\n"):
            if not block.strip():
                story.append(Spacer(1, 8))
            else:
                story.append(Paragraph(block.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"), body_style))
        document.build(story)
        return buffer.getvalue()
