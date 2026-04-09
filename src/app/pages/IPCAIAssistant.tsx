import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { BookOpen, Brain, AlertCircle } from "lucide-react";
import { apiGet, apiPost } from "../lib/apiClient";
import type { IPCExplainResponse, IPCSearchResult } from "../types/api";
import { useLanguage } from "../lib/language";

export default function IPCAIAssistant() {
  const { language, isHindi, toggleLanguage } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IPCSearchResult[]>([]);
  const [selected, setSelected] = useState<IPCExplainResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchSection = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setSelected(null);
    setError("");

    try {
      const data = await apiGet<IPCSearchResult[]>(
        `/api/ipc/assistant/search?q=${encodeURIComponent(query)}&language=${language}`
      );
      setResults(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const explainSection = async (section: string) => {
    setLoading(true);
    setError("");

    try {
      const data = await apiPost<IPCExplainResponse, { section: string }>(
        `/api/ipc/assistant/explain?language=${language}`,
        { section }
      );
      setSelected(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 py-10 max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
          <div>
            <h1 className="text-3xl text-[#1a2847] mb-2">
              {isHindi ? "IPC AI Assistant" : "IPC AI Assistant"}
            </h1>
            <p className="text-gray-600">
              {isHindi
                ? "IPC धाराओं को खोजें और सरल व्याख्या पाएं"
                : "Search IPC sections & get simplified explanations (educational)"}
            </p>
          </div>
          <Button variant="outline" onClick={toggleLanguage}>
            {isHindi ? "English" : "हिन्दी"}
          </Button>
        </div>

        {/* SEARCH */}
        <Card className="mb-6">
          <CardContent className="p-6 flex gap-4">
            <Input
              placeholder="Search IPC section (e.g. 302, murder, theft)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              className="bg-[#1a2847]"
              onClick={searchSection}
            >
              Search
            </Button>
          </CardContent>
        </Card>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* SEARCH RESULTS */}
        {results.length > 0 && !selected && (
          <div className="space-y-4">
            {results.map((r, i) => (
              <Card key={i}>
                <CardHeader className="bg-[#1a2847] text-white">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen />
                    IPC Section {r.section} – {r.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {r.law_text}
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => explainSection(r.section)}
                  >
                    Explain in Simple Language
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* AI EXPLANATION */}
        {selected && (
          <Card className="mt-6">
            <CardHeader className="bg-[#1a2847] text-white">
              <CardTitle className="flex items-center gap-2">
                <Brain />
                IPC Section {selected.section} – Explained
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p><strong>Title:</strong> {selected.title}</p>
              <p><strong>Law Text:</strong></p>
              <p className="text-sm text-gray-700">
                {selected.law_text}
              </p>

              <div className="bg-green-50 border border-green-300 p-4 rounded">
                <p className="font-semibold mb-2">Simple Explanation:</p>
                <p className="text-sm text-gray-700">
                  {selected.simple_explanation}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* DISCLAIMER */}
        <Card className="mt-8 bg-yellow-50 border-2 border-yellow-200">
          <CardContent className="p-4 flex gap-2">
            <AlertCircle className="text-yellow-700" />
            <p className="text-sm text-gray-700">
              This assistant is for educational purposes only and does not
              constitute legal advice.
            </p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
