from __future__ import annotations

from functools import lru_cache
from typing import Literal

from deep_translator import GoogleTranslator

Language = Literal["en", "hi"]

HINDI_HINTS = {
    "murder": "हत्या",
    "theft": "चोरी",
    "rape": "बलात्कार",
    "assault": "हमला",
    "dowry": "दहेज",
    "police": "पुलिस",
    "complaint": "शिकायत",
    "fir": "एफआईआर",
    "law": "कानून",
}


@lru_cache(maxsize=256)
def _translator(source: str, target: str):
    return GoogleTranslator(source=source, target=target)


def translate_text(text: str, source: Language = "en", target: Language = "en") -> str:
    if not text or source == target:
        return text

    try:
        return _translator(source, target).translate(text)
    except Exception:
        if source == "hi" and target == "en":
            lowered = text.lower()
            for english, hindi in HINDI_HINTS.items():
                lowered = lowered.replace(hindi.lower(), english)
            return lowered
        if source == "en" and target == "hi":
            translated = text
            for english, hindi in HINDI_HINTS.items():
                translated = translated.replace(english, hindi)
            return translated
        return text
