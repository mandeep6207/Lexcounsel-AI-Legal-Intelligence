from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List, Optional

import numpy as np
from sentence_transformers import SentenceTransformer

try:
    import faiss
except ImportError:  # pragma: no cover - Windows and unsupported wheels fallback
    faiss = None


@dataclass
class SearchHit:
    item: Dict[str, Any]
    score: float


class EmbeddingIndex:
    def __init__(self, rows: List[Dict[str, Any]], text_builder, model_name: str = "all-MiniLM-L6-v2"):
        self.rows = rows
        self.text_builder = text_builder
        self.model = SentenceTransformer(model_name)
        self._embeddings = self._encode_rows(rows)
        self.index = self._build_index(self._embeddings)
        self._use_faiss = faiss is not None and self.index is not None

    def _encode_rows(self, rows: List[Dict[str, Any]]) -> np.ndarray:
        texts = [self.text_builder(row) for row in rows]
        embeddings = self.model.encode(
            texts,
            batch_size=32,
            show_progress_bar=False,
            convert_to_numpy=True,
            normalize_embeddings=True,
        )
        return embeddings.astype("float32")

    def _build_index(self, embeddings: np.ndarray):
        if faiss is None:
            return None

        dimension = embeddings.shape[1]
        index = faiss.IndexFlatIP(dimension)
        index.add(embeddings)
        return index

    def search(self, query: str, top_k: int = 3) -> List[SearchHit]:
        query_embedding = self.model.encode(
            [query],
            show_progress_bar=False,
            convert_to_numpy=True,
            normalize_embeddings=True,
        ).astype("float32")

        if self._use_faiss:
            scores, indices = self.index.search(query_embedding, top_k)
            raw_hits = zip(scores[0], indices[0])
        else:
            scores_array = self._embeddings @ query_embedding[0]
            ranked_indices = np.argsort(scores_array)[::-1][:top_k]
            raw_hits = ((scores_array[index], index) for index in ranked_indices)

        hits: List[SearchHit] = []
        for score, index in raw_hits:
            if index < 0:
                continue
            hits.append(SearchHit(item=self.rows[index], score=float(score)))
        return hits
