# API Contract (v1)

All endpoints return a unified envelope:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {}
}
```

Error envelope:

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Validation failed",
    "details": []
  }
}
```

## GET /api/health
- data:
  - status: string
  - ipc_rows: number
  - women_rows: number
  - judgments: number
  - ipc_sections: number
  - helplines: number

## GET /api/crime/summary
- data: array of
  - YEAR: number
  - TOTAL IPC CRIMES: number

## GET /api/ipc/records
- data:
  - available_years: number[]
  - available_states: string[]

## GET /api/ipc/dashboard?year=&state=
- data:
  - available_years: number[]
  - available_states: string[]
  - state_wise: { STATE/UT: string, TOTAL IPC CRIMES: number }[]
  - crime_totals: Record<string, number>

## GET /api/ipc/districts?year=&state=
- data: { DISTRICT: string, TOTAL IPC CRIMES: number }[]

## GET /api/women/dashboard?year=&state=
- data:
  - available_years: number[]
  - available_states: string[]
  - state_wise: { State: string, TOTAL WOMEN CRIMES: number }[]
  - crime_totals: Record<string, number>
  - total_cases: number

## GET /api/ipc/assistant/search?q=
- data: array of
  - section: string
  - title: string
  - law_text: string
  - similarity: number

## POST /api/ipc/assistant/explain
- request:
  - section: string
- data:
  - section: string
  - title: string
  - law_text: string
  - simple_explanation: string
  - citations: string[]

## POST /api/sc/query
- request:
  - question: string
- data:
  - user_question: string
  - match_percentage: number
  - confidence: High | Medium | Low
  - case_name: string
  - judgment_date: string
  - matched_question: string
  - answer: string
  - citations: { case_name: string, question: string, score: number }[]

## POST /api/case/predict
- request:
  - case_type: string
  - ipc_section: string
  - case_facts_summary: string
  - evidence_strength: string
  - past_record: string
- data:
  - possible_outcome: { probability: string, result: string, basis: string }
  - outcome_distribution: { label: string, probability: number }[]
  - key_factors: string[]
  - ai_reasoning: string
  - next_steps: string[]
  - disclaimer: string
