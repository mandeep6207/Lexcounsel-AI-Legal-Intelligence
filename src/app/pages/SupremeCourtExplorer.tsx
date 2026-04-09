import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, AlertCircle, Gavel } from "lucide-react";
import { apiPost } from "../lib/apiClient";
import type { SupremeCourtResponse } from "../types/api";
import { useLanguage } from "../lib/language";

export default function SupremeCourtExplorer() {
  const { language, isHindi, toggleLanguage } = useLanguage();
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<SupremeCourtResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await apiPost<SupremeCourtResponse, { question: string }>(
        `/api/sc/query?language=${language}`,
        { question }
      );

      // 🔒 SAFETY GATE
      if (data.match_percentage < 50) {
        setError(
          "No sufficiently relevant Supreme Court judgment found for this question. Try rephrasing using legal terms."
        );
        setLoading(false);
        return;
      }

      setResult(data);
    } catch (err) {
      setError((err as Error).message || "Backend not reachable. Please ensure server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-8">
            <div>
              <h1 className="text-4xl text-[#1a2847] mb-2">
                Supreme Court AI Lawyer
              </h1>
              <p className="text-gray-600">
                {isHindi
                  ? "सुप्रीम कोर्ट के फैसलों के आधार पर उत्तर पाएं"
                  : "Ask legal questions and get answers strictly based on Supreme Court judgments"}
              </p>
            </div>
            <Button variant="outline" onClick={toggleLanguage}>
              {isHindi ? "English" : "हिन्दी"}
            </Button>
          </div>

          {/* SEARCH BOX */}
          <Card className="mb-6">
            <CardContent className="p-6 flex gap-4">
              <Input
                placeholder="Ask a legal question (use court-style language)"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <Button
                onClick={handleSearch}
                className="bg-[#1a2847] hover:bg-[#2a3857]"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </CardContent>
          </Card>

          {loading && <p className="text-gray-600">Searching judgments...</p>}

          {/* ERROR / WARNING */}
          {error && (
            <Card className="bg-yellow-50 border-2 border-yellow-300">
              <CardContent className="p-4 flex gap-2">
                <AlertCircle className="text-yellow-700" />
                <p className="text-sm text-gray-700">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* RESULT */}
          {result && (
            <Card className="mt-6">
              <CardHeader className="bg-[#1a2847] text-white">
                <CardTitle className="flex items-center gap-2">
                  <Gavel /> {result.case_name}
                </CardTitle>
                <p className="text-sm text-gray-300">
                  Match: {result.match_percentage}% | Confidence:{" "}
                  {result.confidence}
                </p>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#1a2847]">
                    Matched Question
                  </h3>
                  <p className="text-gray-700">
                    {result.matched_question}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#1a2847]">
                    Supreme Court Answer
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {result.answer}
                  </p>
                </div>

                <div className="text-sm text-gray-500">
                  ⚠️ This response is retrieved from Supreme Court datasets for
                  educational purposes only.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
