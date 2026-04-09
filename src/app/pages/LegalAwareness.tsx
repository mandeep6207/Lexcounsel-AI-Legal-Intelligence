import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { apiGet } from "../lib/apiClient";
import type {
  HelplineRecord,
  LegalAwarenessResponse,
  LegalFAQ,
} from "../types/api";

const categories = [
  { key: "Women Rights", label: "Women Rights", emoji: "👩‍⚖️" },
  { key: "Family & Marriage Rights", label: "Family & Marriage", emoji: "👨‍👩‍👧" },
  { key: "Child Rights", label: "Child Rights", emoji: "🧒" },
  { key: "Police & Arrest Rights", label: "Police & Arrest", emoji: "👮" },
  { key: "Workplace Rights", label: "Workplace Rights", emoji: "💼" },
  { key: "Property & Tenant Rights", label: "Property & Tenant", emoji: "🏠" },
];

export default function LegalAwareness() {
  const [rightsData, setRightsData] = useState<LegalAwarenessResponse>({});
  const [faqs, setFaqs] = useState<LegalFAQ[]>([]);
  const [helplines, setHelplines] = useState<HelplineRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiGet<LegalAwarenessResponse>("/api/legal-awareness"),
      apiGet<LegalFAQ[]>("/api/legal-faqs"),
      apiGet<HelplineRecord[]>("/api/helplines"),
    ])
      .then(([rights, faqData, helplineData]) => {
        setRightsData(rights);
        setFaqs(faqData);
        setHelplines(helplineData);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const allIndia = helplines.find(h => h.state === "All India");
  const states = helplines.filter(h => h.state !== "All India");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl text-[#1a2847] mb-3">Legal Awareness</h1>
        <p className="text-gray-600 mb-8">
          Know your rights, legal protections and emergency support.
        </p>

        {loading && <p className="text-gray-600 mb-4">Loading legal awareness content...</p>}
        {error && <p className="text-red-600 mb-4">Failed to load legal awareness data: {error}</p>}

        {/* CATEGORIES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {categories.map(cat => (
            <Card
              key={cat.key}
              className="cursor-pointer hover:shadow-xl text-center"
              onClick={() => setSelectedCategory(cat.key)}
            >
              <CardContent className="p-6">
                <div className="text-5xl mb-3">{cat.emoji}</div>
                <h3 className="text-xl text-[#1a2847]">{cat.label}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* RIGHTS */}
        {selectedCategory && rightsData[selectedCategory] && (
          <Card className="mb-10">
            <CardHeader>
              <CardTitle>{selectedCategory}</CardTitle>
            </CardHeader>
            <CardContent>
              {rightsData[selectedCategory].map((r, i: number) => (
                <div key={i} className="mb-4">
                  <strong>{r.title}</strong>
                  <p className="text-gray-600">{r.description}</p>
                  <p className="text-sm text-blue-600">{r.law}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* FAQs */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            {faqs.map((f, i) => (
              <div key={i} className="mb-3">
                <div
                  className="cursor-pointer font-medium"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {f.question}
                </div>
                {openFaq === i && (
                  <p className="text-gray-600 mt-1">
                    {f.answer}
                    <br />
                    <span className="text-sm text-blue-600">{f.law}</span>
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* HELPLINES */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency & Legal Helplines</CardTitle>
          </CardHeader>
          <CardContent>
            {/* All India */}
            {allIndia && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg">🇮🇳 All India</h3>
                {allIndia.services.map((s, i: number) => (
                  <p key={i}>
                    <strong>{s.type}:</strong> {s.number}
                  </p>
                ))}
              </div>
            )}

            {/* State-wise */}
            {states.map((state, i) => (
              <div key={i} className="mb-4">
                <h4 className="font-medium">{state.state}</h4>
                {state.services.map((s, j: number) => (
                  <p key={j} className="text-sm">
                    {s.type}: {s.number}
                  </p>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
