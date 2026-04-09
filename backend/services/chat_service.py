from __future__ import annotations

from typing import Dict, List

from services.embedding_service import EmbeddingIndex
from services.translation_service import translate_text


class LegalChatService:
    def __init__(self, ipc_index: EmbeddingIndex, sc_index: EmbeddingIndex):
        self.ipc_index = ipc_index
        self.sc_index = sc_index

    def ask(self, message: str, language: str = "en") -> Dict[str, object]:
        normalized = translate_text(message, source=language, target="en") if language == "hi" else message
        ipc_hits = self.ipc_index.search(normalized, top_k=2)
        sc_hits = self.sc_index.search(normalized, top_k=1)

        citations: List[Dict[str, object]] = []
        answer_parts: List[str] = []

        if ipc_hits:
            best_ipc = ipc_hits[0]
            citations.append(
                {
                    "type": "ipc",
                    "title": best_ipc.item.get("title", ""),
                    "section": best_ipc.item.get("section", ""),
                    "score": round(best_ipc.score, 4),
                }
            )
            answer_parts.append(
                f"Relevant IPC section: {best_ipc.item.get('section', '')} - {best_ipc.item.get('title', '')}."
            )
            answer_parts.append(best_ipc.item.get("law_text", ""))

        if sc_hits:
            best_sc = sc_hits[0]
            citations.append(
                {
                    "type": "supreme_court",
                    "case_name": best_sc.item.get("case_name", ""),
                    "question": best_sc.item.get("question", ""),
                    "score": round(best_sc.score, 4),
                }
            )
            answer_parts.append(f"Related Supreme Court reference: {best_sc.item.get('case_name', '')}.")
            answer_parts.append(best_sc.item.get("answer", ""))

        if not answer_parts:
            answer_parts.append("I could not find a strong legal match. Please rephrase with IPC section, case type, or factual details.")

        score = max([hit.score for hit in ipc_hits + sc_hits], default=0.0)
        confidence = "High" if score >= 0.65 else "Medium" if score >= 0.35 else "Low"
        answer = "\n\n".join([part for part in answer_parts if part])
        translated_answer = translate_text(answer, source="en", target=language) if language == "hi" else answer

        return {
            "answer": translated_answer,
            "confidence": confidence,
            "citations": citations,
            "query_normalized": normalized,
        }
