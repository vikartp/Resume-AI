import unicodedata
from fpdf import FPDF

_UNICODE_REPLACEMENTS = {
    "\u2013": "-",    # en dash
    "\u2014": "--",   # em dash
    "\u2012": "-",    # figure dash
    "\u2010": "-",    # hyphen
    "\u2011": "-",    # non-breaking hyphen
    "\u2015": "--",   # horizontal bar
    "\u2018": "'",    # left single quote
    "\u2019": "'",    # right single quote
    "\u201a": ",",    # single low-9 quote
    "\u201c": '"',    # left double quote
    "\u201d": '"',    # right double quote
    "\u2022": "-",    # bullet
    "\u2026": "...",  # ellipsis
    "\u00b7": "-",    # middle dot
    "\u2039": "<",    # single left-pointing angle quote
    "\u203a": ">",    # single right-pointing angle quote
}


def _sanitize(text: str) -> str:
    for char, replacement in _UNICODE_REPLACEMENTS.items():
        text = text.replace(char, replacement)
    # Normalize remaining accented/decomposable chars, drop anything still outside latin-1
    text = unicodedata.normalize("NFKD", text)
    return text.encode("latin-1", "ignore").decode("latin-1")


class ResumePDF(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=20)

    def normalize_text(self, text: str) -> str:  # type: ignore[override]
        return super().normalize_text(_sanitize(text))

    def header(self):
        pass

    def footer(self):
        pass

    def section_title(self, title: str):
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(33, 55, 80)
        self.cell(0, 7, title.upper(), new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(180, 195, 210)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(3)

    def body_text(self, text: str):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(50, 50, 50)
        self.multi_cell(0, 5, text)
        self.ln(2)

    def bullet(self, text: str):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(50, 50, 50)
        bullet_w = 5
        self.cell(bullet_w, 5, "-")
        remaining = self.w - self.l_margin - self.r_margin - bullet_w
        self.multi_cell(remaining, 5, text)
        self.ln(1)


def generate_resume_pdf(resume_json: dict) -> bytes:
    """Generate an ATS-friendly PDF from resume JSON using fpdf2."""
    pdf = ResumePDF()
    pdf.add_page()
    pdf.set_margins(20, 20, 20)

    contact = resume_json.get("contact", {})

    # Name
    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(33, 55, 80)
    pdf.cell(0, 10, contact.get("name", ""), align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

    # Contact info line
    contact_parts = []
    if contact.get("email"):
        contact_parts.append(contact["email"])
    if contact.get("phone"):
        contact_parts.append(contact["phone"])
    if contact.get("location"):
        contact_parts.append(contact["location"])
    if contact.get("linkedin"):
        contact_parts.append(contact["linkedin"])

    if contact_parts:
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(100, 100, 100)
        pdf.cell(0, 5, " | ".join(contact_parts), align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    # Professional Summary
    summary = resume_json.get("professional_summary", "")
    if summary:
        pdf.section_title("Professional Summary")
        pdf.body_text(summary)
        pdf.ln(2)

    # Skills
    skills = resume_json.get("skills", {})
    if skills:
        pdf.section_title("Skills")
        skill_groups = [
            ("Technical", skills.get("technical", [])),
            ("Soft Skills", skills.get("soft", [])),
            ("Tools", skills.get("tools", [])),
        ]
        for label, items in skill_groups:
            if not items:
                continue
            pdf.set_font("Helvetica", "B", 10)
            pdf.set_text_color(50, 50, 50)
            label_text = f"{label}: "
            label_w = pdf.get_string_width(label_text) + 2
            pdf.cell(label_w, 5, label_text)
            pdf.set_font("Helvetica", "", 10)
            remaining = pdf.w - pdf.l_margin - pdf.r_margin - label_w
            pdf.multi_cell(remaining, 5, ", ".join(items))
        pdf.ln(3)

    # Experience
    experience = resume_json.get("experience", [])
    if experience:
        pdf.section_title("Professional Experience")
        for exp in experience:
            pdf.set_font("Helvetica", "B", 10)
            pdf.set_text_color(33, 55, 80)
            pdf.cell(0, 5, exp.get("title", ""), new_x="LMARGIN", new_y="NEXT")

            pdf.set_font("Helvetica", "I", 9)
            pdf.set_text_color(80, 80, 80)
            company_line = exp.get("company", "")
            if exp.get("duration"):
                company_line += f"  |  {exp['duration']}"
            pdf.cell(0, 5, company_line, new_x="LMARGIN", new_y="NEXT")
            pdf.ln(1)

            for achievement in exp.get("achievements", []):
                pdf.bullet(achievement)
            pdf.ln(3)

    # Education
    education = resume_json.get("education", [])
    if education:
        pdf.section_title("Education")
        for edu in education:
            pdf.set_font("Helvetica", "B", 10)
            pdf.set_text_color(50, 50, 50)
            pdf.cell(0, 5, edu.get("degree", ""), new_x="LMARGIN", new_y="NEXT")
            pdf.set_font("Helvetica", "", 9)
            pdf.set_text_color(80, 80, 80)
            details = edu.get("institution", "")
            if edu.get("year"):
                details += f" - {edu['year']}"
            pdf.cell(0, 5, details, new_x="LMARGIN", new_y="NEXT")
            pdf.ln(2)

    # Certifications
    certifications = resume_json.get("certifications", [])
    if certifications:
        pdf.section_title("Certifications")
        for cert in certifications:
            pdf.bullet(cert)

    return bytes(pdf.output())
