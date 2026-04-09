import json
import os
import pandas as pd


class DataStore:
    def __init__(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        data_dir = os.path.join(base_dir, "data")

        self.ipc_df = pd.read_csv(os.path.join(data_dir, "ipc_crime.csv")).fillna(0)
        self.women_df = pd.read_csv(os.path.join(data_dir, "women_crime.csv")).fillna(0)

        self.ipc_df.columns = self.ipc_df.columns.str.strip()
        self.women_df.columns = self.women_df.columns.str.strip()

        with open(os.path.join(data_dir, "supreme_court.json"), encoding="utf-8") as f:
            self.judgments = json.load(f)

        with open(os.path.join(data_dir, "ipc_sections.json"), encoding="utf-8") as f:
            self.ipc_sections = json.load(f)

        with open(os.path.join(data_dir, "legal_awareness.json"), encoding="utf-8") as f:
            self.legal_awareness = json.load(f)

        with open(os.path.join(data_dir, "legal_faqs.json"), encoding="utf-8") as f:
            self.legal_faqs = json.load(f)

        with open(os.path.join(data_dir, "helplines.json"), encoding="utf-8") as f:
            self.helplines = json.load(f)

        self.case_dataset_path = os.path.join(data_dir, "case_outcome_dataset.csv")


data_store = DataStore()
