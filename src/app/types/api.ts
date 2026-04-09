export interface ApiError {
  message: string;
  details?: unknown;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error: ApiError | null;
  meta?: Record<string, unknown>;
}

export interface CrimeSummaryRow {
  YEAR: number;
  "TOTAL IPC CRIMES": number;
}

export interface WomenDashboardResponse {
  available_years: number[];
  available_states: string[];
  state_wise: Array<{ State: string; "TOTAL WOMEN CRIMES": number }>;
  crime_totals: Record<string, number>;
  total_cases: number;
}

export interface IPCDashboardResponse {
  available_years: number[];
  available_states: string[];
  state_wise: Array<{ "STATE/UT": string; "TOTAL IPC CRIMES": number }>;
  crime_totals: Record<string, number>;
}

export interface DistrictCrimeRow {
  DISTRICT: string;
  "TOTAL IPC CRIMES": number;
}

export interface IPCSearchResult {
  section: string;
  title: string;
  law_text: string;
  similarity: number;
}

export interface IPCExplainResponse {
  section: string;
  title: string;
  law_text: string;
  simple_explanation: string;
  citations: string[];
}

export interface SupremeCourtResponse {
  user_question: string;
  match_percentage: number;
  confidence: "High" | "Medium" | "Low";
  case_name: string;
  judgment_date: string;
  matched_question: string;
  answer: string;
  citations: Array<{
    case_name: string;
    question: string;
    score: number;
  }>;
}

export interface CasePredictionResponse {
  possible_outcome: {
    probability: string;
    result: string;
    basis: string;
  };
  outcome_distribution: Array<{ label: string; probability: number }>;
  key_factors: string[];
  ai_reasoning: string;
  next_steps: string[];
  disclaimer: string;
}

export interface LegalFAQ {
  question: string;
  answer: string;
  law: string;
}

export interface LegalRight {
  title: string;
  description: string;
  law: string;
}

export type LegalAwarenessResponse = Record<string, LegalRight[]>;

export interface HelplineService {
  type: string;
  number: string;
}

export interface HelplineRecord {
  state: string;
  services: HelplineService[];
}
