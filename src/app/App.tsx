import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const PersonalDetails = lazy(() => import("./pages/PersonalDetails"));
const EducationDetails = lazy(() => import("./pages/EducationDetails"));
const PurposeAwareness = lazy(() => import("./pages/PurposeAwareness"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ChatAssistant = lazy(() => import("./pages/ChatAssistant"));
const DocumentGenerator = lazy(() => import("./pages/DocumentGenerator"));
const WomenCrimesAnalytics = lazy(() => import("./pages/WomenCrimesAnalytics"));
const IPCCrimeDashboard = lazy(() => import("./pages/IPCCrimeDashboard"));
const IPCAIAssistant = lazy(() => import("./pages/IPCAIAssistant"));
const SupremeCourtExplorer = lazy(() => import("./pages/SupremeCourtExplorer"));
const CaseOutcomePredictor = lazy(() => import("./pages/CaseOutcomePredictor"));
const LegalAwareness = lazy(() => import("./pages/LegalAwareness"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-6 text-center">Loading page...</div>}>
        <Routes>

        {/* ✅ Landing Page FIRST */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Onboarding Flow */}
        <Route path="/onboarding/personal" element={<PersonalDetails />} />
        <Route path="/onboarding/education" element={<EducationDetails />} />
        <Route path="/onboarding/purpose" element={<PurposeAwareness />} />

        {/* Main Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Analytics */}
        <Route path="/analytics/women-crimes" element={<WomenCrimesAnalytics />} />
        <Route path="/analytics/ipc-trends" element={<IPCCrimeDashboard />} />

        {/* AI Tools */}
        <Route path="/tools/ipc-assistant" element={<IPCAIAssistant />} />
        <Route path="/tools/chat-assistant" element={<ChatAssistant />} />
        <Route path="/tools/document-generator" element={<DocumentGenerator />} />
        <Route path="/tools/supreme-court" element={<SupremeCourtExplorer />} />
        <Route path="/tools/case-predictor" element={<CaseOutcomePredictor />} />

        {/* Legal Awareness */}
        <Route path="/legal-awareness" element={<LegalAwareness />} />

        {/* Contact */}
        <Route path="/contact" element={<ContactPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
