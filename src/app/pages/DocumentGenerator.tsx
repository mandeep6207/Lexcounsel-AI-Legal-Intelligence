import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { apiPost } from "../lib/apiClient";
import { Download, FileText } from "lucide-react";

export default function DocumentGenerator() {
  const [documentType, setDocumentType] = useState("fir");
  const [name, setName] = useState("");
  const [incident, setIncident] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [pdfBase64, setPdfBase64] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiPost<{
        document_type: string;
        text: string;
        pdf_base64: string;
        filename: string;
      }, {
        document_type: string;
        name: string;
        incident: string;
        location: string;
        date: string;
      }>("/api/documents/generate", {
        document_type: documentType,
        name,
        incident,
        location,
        date,
      });
      setGeneratedText(data.text);
      setPdfBase64(data.pdf_base64);
    } catch (err) {
      setError((err as Error).message || "Unable to generate document.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    if (!pdfBase64) return;
    const binary = atob(pdfBase64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${documentType}_draft.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader className="bg-[#1a2847] text-white">
              <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Legal Document Generator</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>}
              <div>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fir">FIR Draft</SelectItem>
                    <SelectItem value="complaint">Complaint Letter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Textarea placeholder="Incident summary" value={incident} onChange={(e) => setIncident(e.target.value)} />
              <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
              <Input placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} />
              <Button onClick={handleGenerate} className="w-full bg-[#ff9933] hover:bg-[#ff8800] text-white" disabled={loading}>
                {loading ? "Generating..." : "Generate Document"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-[#1a2847] text-white">
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {generatedText ? (
                <>
                  <pre className="whitespace-pre-wrap text-sm bg-gray-50 border rounded-lg p-4 max-h-[540px] overflow-auto">{generatedText}</pre>
                  <Button variant="outline" onClick={downloadPdf} className="w-full">
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                  </Button>
                </>
              ) : (
                <div className="min-h-[420px] flex items-center justify-center text-gray-500 border border-dashed rounded-lg">
                  Fill the form to generate FIR or complaint draft.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
