from pydantic import BaseModel, Field


class IPCExplainRequest(BaseModel):
    section: str = Field(min_length=1)


class SupremeCourtQueryRequest(BaseModel):
    question: str = Field(min_length=3, max_length=500)


class CasePredictRequest(BaseModel):
    case_type: str = Field(default="Criminal")
    ipc_section: str = Field(default="")
    case_facts_summary: str = Field(min_length=5)
    evidence_strength: str = Field(default="Moderate")
    past_record: str = Field(default="None")


class ChatRequest(BaseModel):
    message: str = Field(min_length=2, max_length=500)
    language: str = Field(default="en")


class DocumentRequest(BaseModel):
    document_type: str = Field(pattern="^(fir|complaint)$")
    name: str = Field(min_length=2, max_length=100)
    incident: str = Field(min_length=5, max_length=1000)
    location: str = Field(min_length=2, max_length=200)
    date: str = Field(min_length=4, max_length=50)


class LanguageRequest(BaseModel):
    language: str = Field(default="en")
