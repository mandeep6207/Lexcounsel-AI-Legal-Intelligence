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
