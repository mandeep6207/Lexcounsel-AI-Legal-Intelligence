import { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { apiPost } from "../lib/apiClient";
import { useLanguage } from "../lib/language";
import type { IPCSearchResult, SupremeCourtResponse } from "../types/api";
import { Bot, Send, User } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  confidence?: "High" | "Medium" | "Low";
  citations?: Array<Record<string, unknown>>;
}

export default function ChatAssistant() {
  const { language, isHindi, toggleLanguage } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "seed",
      role: "assistant",
      text: "Ask me about IPC sections, Supreme Court cases, or legal rights.",
      confidence: "High",
      citations: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const nextUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: input.trim(),
    };

    setMessages((current) => [...current, nextUserMessage]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const chatResult = await apiPost<{
        answer: string;
        confidence: "High" | "Medium" | "Low";
        citations: Array<Record<string, unknown>>;
        query_normalized: string;
      }, { message: string; language: string }>("/api/chat", {
        message: nextUserMessage.text,
        language,
      });

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: chatResult.answer,
          confidence: chatResult.confidence,
          citations: chatResult.citations,
        },
      ]);
    } catch (err) {
      setError((err as Error).message || "Unable to fetch assistant response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-3xl text-[#1a2847]">Legal Chat Assistant</h1>
              <p className="text-gray-600">WhatsApp-style guidance with citations and confidence scores.</p>
            </div>
            <Button variant="outline" onClick={toggleLanguage}>
              {isHindi ? "English" : "हिन्दी"}
            </Button>
          </div>

          {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>}

          <Card className="shadow-lg">
            <CardHeader className="bg-[#1a2847] text-white">
              <CardTitle>Conversation</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[65vh] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                        message.role === "user"
                          ? "bg-[#1a2847] text-white rounded-br-sm"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        <span className="text-xs uppercase tracking-wide opacity-75">
                          {message.role === "user" ? "You" : "AI Assistant"}
                        </span>
                        {message.confidence && <Badge>{message.confidence}</Badge>}
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-6">{message.text}</p>
                      {message.citations && message.citations.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.citations.map((citation, index) => (
                            <div key={index} className="rounded-lg bg-gray-50 border border-gray-200 p-2 text-xs text-gray-600">
                              {JSON.stringify(citation)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-sm bg-white border border-gray-200 px-4 py-3 shadow-sm text-sm text-gray-500">
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="border-t p-4 bg-white">
                <div className="flex gap-3">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isHindi ? "अपना कानूनी प्रश्न लिखें" : "Type your legal question"}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button onClick={sendMessage} disabled={!canSend} className="bg-[#ff9933] hover:bg-[#ff8800] text-white">
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
