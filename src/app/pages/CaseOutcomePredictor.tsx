import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Brain, AlertTriangle, Shield, FileText } from "lucide-react";
import { apiPost } from "../lib/apiClient";
import type { CasePredictionResponse } from "../types/api";

export default function CaseOutcomePredictor() {
  const [loading, setLoading] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);

  const [caseType, setCaseType] = useState("");
  const [ipcSection, setIpcSection] = useState("");
  const [caseFacts, setCaseFacts] = useState("");
  const [evidence, setEvidence] = useState("Moderate");
  const [pastRecord, setPastRecord] = useState("None");

  const [prediction, setPrediction] = useState<CasePredictionResponse | null>(null);
  const [error, setError] = useState("");

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiPost<CasePredictionResponse, {
        case_type: string;
        ipc_section: string;
        case_facts_summary: string;
        evidence_strength: string;
        past_record: string;
      }>("/api/case/predict", {
          case_type: caseType,
          ipc_section: ipcSection,
          case_facts_summary: caseFacts,
          evidence_strength: evidence,
          past_record: pastRecord,
      });
      setPrediction(data);
      setShowPrediction(true);
    } catch (err) {
      setError((err as Error).message || "Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-4xl text-[#1a2847] mb-2">
            Case Outcome Predictor (Educational Prototype)
          </h1>
          <p className="text-gray-600 mb-8">
            Explainable, dataset-driven legal outcome simulation
          </p>

          {error && (
            <Card className="mb-8 bg-red-50 border-2 border-red-200">
              <CardContent className="p-4 text-red-700">{error}</CardContent>
            </Card>
          )}

          {/* DISCLAIMER */}
          <Card className="mb-8 bg-red-50 border-2 border-red-200">
            <CardContent className="p-6 flex gap-3">
              <AlertTriangle className="w-7 h-7 text-red-600" />
              <p className="text-sm text-red-700">
                <strong>Important:</strong> This tool is meant only to help users understand legal concepts and is not legal advice.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* INPUT FORM */}
            <Card>
              <CardHeader className="bg-[#1a2847] text-white">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Case Details
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={handlePredict} className="space-y-5">
                  <div>
                    <Label>Case Type</Label>
                    <Select onValueChange={setCaseType} required>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select case type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Criminal">Criminal</SelectItem>
                        <SelectItem value="Civil">Civil</SelectItem>
                        <SelectItem value="Family">Family</SelectItem>
                        <SelectItem value="Property">Property</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Relevant IPC Section</Label>
                    <Input
                      className="mt-2"
                      placeholder="e.g. IPC 420"
                      value={ipcSection}
                      onChange={(e) => setIpcSection(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Case Facts Summary</Label>
                    <Textarea
                      className="mt-2 min-h-[120px]"
                      placeholder="Briefly describe the facts, events, and circumstances of the case..."
                      value={caseFacts}
                      onChange={(e) => setCaseFacts(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Evidence Strength</Label>
                    <Select onValueChange={setEvidence} defaultValue="Moderate">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strong">Strong</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Weak">Weak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Past Criminal Record</Label>
                    <Select onValueChange={setPastRecord} defaultValue="None">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Minor">Minor</SelectItem>
                        <SelectItem value="Serious">Serious</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#1a2847]"
                    disabled={loading}
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    {loading ? "Analyzing Case..." : "Predict Outcome"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* RESULT */}
            {showPrediction && prediction ? (
              <Card>
                <CardHeader className="bg-indigo-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Prediction Results
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* POSSIBLE OUTCOME */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Possible Outcome
                    </h3>
                    <p className="text-xl text-blue-800">
                      {prediction.possible_outcome.probability}{" "}
                      {prediction.possible_outcome.result} Probability
                    </p>
                    <p className="text-sm text-gray-600">
                      {prediction.possible_outcome.basis}
                    </p>
                  </div>

                  {/* KEY FACTORS */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Key Factors Considered
                    </h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {prediction.key_factors.map(
                        (f: string, i: number) => (
                          <li key={i}>✓ {f}</li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* AI REASONING */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">AI Reasoning</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {prediction.ai_reasoning}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {prediction.disclaimer}
                    </p>
                  </div>

                  {/* NEXT STEPS */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Possible Next Steps
                    </h3>
                    <ol className="list-decimal ml-6 text-sm text-gray-700">
                      {prediction.next_steps.map(
                        (s: string, i: number) => (
                          <li key={i}>{s}</li>
                        )
                      )}
                    </ol>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center text-gray-500">
                  Enter case details to view AI-based prediction
                </CardContent>
              </Card>
            )}
          </div>

          {/* FINAL DISCLAIMER */}
          <Card className="mt-8 bg-yellow-50 border-yellow-200">
            <CardContent className="p-4 flex gap-2 text-sm">
              <Shield className="w-5 h-5 text-yellow-600" />
              Always consult a qualified lawyer for real legal matters.
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
