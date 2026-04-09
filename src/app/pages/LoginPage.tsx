import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { setStoredUser } from "../lib/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!name.trim() || !email.trim()) {
      setError("Enter your name and email to continue.");
      return;
    }

    setStoredUser({ name: name.trim(), email: email.trim() });
    navigate("/dashboard");
  };

  const handleSkip = () => {
    setStoredUser({ name: "Guest User", email: "", guest: true });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 py-12 px-4">
        <div className="max-w-xl mx-auto">
          <Card className="shadow-xl border-2 border-gray-200">
            <CardHeader className="bg-[#1a2847] text-white">
              <CardTitle>Continue to Dashboard</CardTitle>
              <p className="text-sm text-gray-300 mt-1">Dummy login for personalized access</p>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>}

              <div>
                <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Input placeholder="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="bg-[#ff9933] hover:bg-[#ff8800] text-white flex-1" onClick={handleContinue} type="button">
                  Continue to Dashboard
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleSkip} type="button">
                  Skip Login → Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
