from flask import Blueprint, request
import pandas as pd

from schemas.requests import IPCExplainRequest, SupremeCourtQueryRequest, CasePredictRequest
from services.data_store import data_store
from services.retrieval_service import SemanticRetriever
from services.case_model_service import CaseOutcomeModelService
from utils.responses import success_response, error_response


api_bp = Blueprint("api", __name__)

ipc_retriever = SemanticRetriever(
    data_store.ipc_sections,
    text_builder=lambda row: f"{row.get('section', '')} {row.get('title', '')} {row.get('law_text', '')}",
)

sc_retriever = SemanticRetriever(
    data_store.judgments,
    text_builder=lambda row: f"{row.get('question', '')} {row.get('answer', '')} {row.get('case_name', '')}",
)

case_service = CaseOutcomeModelService(data_store.case_dataset_path)
case_service.train()


@api_bp.get("/")
def root():
    return success_response({"message": "AI Lawyer Backend is running", "status": "OK"})


@api_bp.get("/api/health")
def health():
    return success_response(
        {
            "status": "Backend running",
            "ipc_rows": len(data_store.ipc_df),
            "women_rows": len(data_store.women_df),
            "judgments": len(data_store.judgments),
            "ipc_sections": len(data_store.ipc_sections),
            "helplines": len(data_store.helplines),
        }
    )


@api_bp.get("/api/crime/summary")
def crime_summary():
    data = (
        data_store.ipc_df.groupby("YEAR")["TOTAL IPC CRIMES"]
        .sum()
        .reset_index()
        .to_dict(orient="records")
    )
    return success_response(data)


@api_bp.get("/api/ipc/dashboard")
def ipc_dashboard():
    year = request.args.get("year")
    state = request.args.get("state")

    df = data_store.ipc_df.copy()
    if year:
        if not year.isdigit():
            return error_response("Invalid year", status=400)
        df = df[df["YEAR"] == int(year)]
    if state:
        df = df[df["STATE/UT"] == state]

    state_summary = (
        df.groupby("STATE/UT")["TOTAL IPC CRIMES"]
        .sum()
        .reset_index()
        .sort_values(by="TOTAL IPC CRIMES", ascending=False)
        .to_dict(orient="records")
    )

    exclude = ["STATE/UT", "DISTRICT", "YEAR", "TOTAL IPC CRIMES"]
    crime_cols = [c for c in df.columns if c not in exclude]

    crime_totals = {
        col: int(pd.to_numeric(df[col], errors="coerce").fillna(0).sum())
        for col in crime_cols
    }

    return success_response(
        {
            "available_years": sorted(data_store.ipc_df["YEAR"].unique().tolist()),
            "available_states": sorted(data_store.ipc_df["STATE/UT"].unique().tolist()),
            "state_wise": state_summary,
            "crime_totals": crime_totals,
        }
    )


@api_bp.get("/api/ipc/districts")
def ipc_districts():
    year = request.args.get("year")
    state = request.args.get("state")

    if not year or not state:
        return success_response([])

    if not year.isdigit():
        return error_response("Invalid year", status=400)

    df = data_store.ipc_df[(data_store.ipc_df["YEAR"] == int(year)) & (data_store.ipc_df["STATE/UT"] == state)]

    districts = (
        df.groupby("DISTRICT")["TOTAL IPC CRIMES"]
        .sum()
        .reset_index()
        .sort_values(by="TOTAL IPC CRIMES", ascending=False)
        .head(10)
        .to_dict(orient="records")
    )

    return success_response(districts)


@api_bp.get("/api/ipc/records")
def ipc_records():
    return success_response(
        {
            "available_years": sorted(data_store.ipc_df["YEAR"].unique().tolist()),
            "available_states": sorted(data_store.ipc_df["STATE/UT"].unique().tolist()),
        }
    )


@api_bp.get("/api/ipc/assistant/search")
def ipc_assistant_search():
    query = request.args.get("q", "").strip().lower()
    if not query:
        return success_response([])

    matches = ipc_retriever.search(query, top_k=5)
    results = [
        {
            "section": match.item.get("section", ""),
            "title": match.item.get("title", ""),
            "law_text": match.item.get("law_text", ""),
            "similarity": round(match.score, 4),
        }
        for match in matches
    ]

    return success_response(results)


@api_bp.post("/api/ipc/assistant/explain")
def ipc_assistant_explain():
    payload = IPCExplainRequest.model_validate(request.get_json(silent=True) or {})

    section = next((s for s in data_store.ipc_sections if s.get("section") == payload.section.strip()), None)
    if not section:
        return error_response("Section not found", status=404)

    return success_response(
        {
            "section": section["section"],
            "title": section["title"],
            "law_text": section["law_text"],
            "simple_explanation": (
                f"IPC Section {section['section']} covers {section['title']}. "
                f"In practical terms: {section['law_text']}"
            ),
            "citations": [f"IPC Section {section['section']}"]
        }
    )


@api_bp.get("/api/women/dashboard")
def women_dashboard():
    year = request.args.get("year")
    state = request.args.get("state")

    df = data_store.women_df.copy()
    if year:
        if not year.isdigit():
            return error_response("Invalid year", status=400)
        df = df[df["Year"] == int(year)]
    if state:
        df = df[df["State"] == state]

    crime_columns = [
        "No. of Rape cases",
        "Kidnap And Assault",
        "Dowry Deaths",
        "Assault against women",
        "Assault against modesty of women",
        "Domestic violence",
        "Women Trafficking",
    ]

    df[crime_columns] = df[crime_columns].apply(pd.to_numeric, errors="coerce").fillna(0)
    df["TOTAL WOMEN CRIMES"] = df[crime_columns].sum(axis=1)

    state_summary = (
        df.groupby("State")["TOTAL WOMEN CRIMES"]
        .sum()
        .reset_index()
        .sort_values(by="TOTAL WOMEN CRIMES", ascending=False)
        .to_dict(orient="records")
    )

    crime_totals = {
        col: int(pd.to_numeric(df[col], errors="coerce").fillna(0).sum())
        for col in crime_columns
    }

    return success_response(
        {
            "available_years": sorted(data_store.women_df["Year"].unique().tolist()),
            "available_states": sorted(data_store.women_df["State"].unique().tolist()),
            "state_wise": state_summary[:10],
            "crime_totals": crime_totals,
            "total_cases": int(df["TOTAL WOMEN CRIMES"].sum()) if not df.empty else 0,
        }
    )


@api_bp.get("/api/legal-awareness")
def get_legal_awareness():
    return success_response(data_store.legal_awareness)


@api_bp.get("/api/legal-faqs")
def get_legal_faqs():
    return success_response(data_store.legal_faqs)


@api_bp.get("/api/helplines")
def get_helplines():
    return success_response(data_store.helplines)


@api_bp.post("/api/sc/query")
def sc_query():
    payload = SupremeCourtQueryRequest.model_validate(request.get_json(silent=True) or {})
    query = payload.question.strip()

    matches = sc_retriever.search(query, top_k=3)
    if not matches:
        return success_response(
            {
                "user_question": query,
                "match_percentage": 0,
                "confidence": "Low",
                "case_name": "No strong match found",
                "judgment_date": "N/A",
                "matched_question": "",
                "answer": "No sufficiently relevant Supreme Court judgment found.",
                "citations": [],
            }
        )

    best = matches[0]
    score_pct = round(best.score * 100, 2)
    confidence = "High" if score_pct >= 70 else "Medium" if score_pct >= 45 else "Low"

    return success_response(
        {
            "user_question": query,
            "match_percentage": score_pct,
            "confidence": confidence,
            "case_name": best.item.get("case_name", "Unknown case"),
            "judgment_date": best.item.get("judgment_date", "Unknown date"),
            "matched_question": best.item.get("question", ""),
            "answer": best.item.get("answer", ""),
            "citations": [
                {
                    "case_name": match.item.get("case_name", ""),
                    "question": match.item.get("question", ""),
                    "score": round(match.score, 4),
                }
                for match in matches
            ],
        }
    )


@api_bp.post("/api/case/predict")
def predict_case():
    payload = CasePredictRequest.model_validate(request.get_json(silent=True) or {})
    prediction = case_service.predict(payload.model_dump())
    return success_response(prediction)
