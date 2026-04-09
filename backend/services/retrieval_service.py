from dataclasses import dataclass
from typing import List, Dict, Any

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


@dataclass
class RetrievalResult:
    item: Dict[str, Any]
    score: float


class SemanticRetriever:
    def __init__(self, rows: List[Dict[str, Any]], text_builder):
        self.rows = rows
        self.text_builder = text_builder
        self.vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=30000)
        corpus = [self.text_builder(row) for row in self.rows]
        self.matrix = self.vectorizer.fit_transform(corpus)

    def search(self, query: str, top_k: int = 5) -> List[RetrievalResult]:
        q_vec = self.vectorizer.transform([query])
        scores = cosine_similarity(q_vec, self.matrix).flatten()
        top_indices = scores.argsort()[::-1][:top_k]

        return [
            RetrievalResult(item=self.rows[idx], score=float(scores[idx]))
            for idx in top_indices
            if scores[idx] > 0
        ]
