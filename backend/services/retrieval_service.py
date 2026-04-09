from dataclasses import dataclass
from typing import List, Dict, Any

from services.embedding_service import EmbeddingIndex


@dataclass
class RetrievalResult:
    item: Dict[str, Any]
    score: float


class SemanticRetriever:
    def __init__(self, rows: List[Dict[str, Any]], text_builder):
        self.index = EmbeddingIndex(rows, text_builder)

    def search(self, query: str, top_k: int = 5) -> List[RetrievalResult]:
        hits = self.index.search(query, top_k=top_k)
        return [RetrievalResult(item=hit.item, score=hit.score) for hit in hits]
