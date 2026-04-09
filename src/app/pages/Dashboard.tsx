import { Link } from 'react-router-dom';
import { useEffect, useState, type ReactNode } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { apiGet } from '../lib/apiClient';
import { useAuth } from '../lib/auth';
import type { CrimeSummaryRow } from '../types/api';
import {
  BookOpen,
  BarChart3,
  Gavel,
  Brain,
  Shield,
  TrendingUp,
  AlertCircle,
  User,
  CheckCircle,
  MessageCircle,
  FileText,
} from 'lucide-react';
import { Progress } from '../components/ui/progress';

export default function Dashboard() {
  const [crimeSummary, setCrimeSummary] = useState<CrimeSummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, signOut } = useAuth();

  useEffect(() => {
    apiGet<CrimeSummaryRow[]>('/api/crime/summary')
      .then((data) => {
        setCrimeSummary(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const totalCrimeReports = crimeSummary.reduce(
    (sum, row) => sum + (row['TOTAL IPC CRIMES'] || 0),
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl text-[#1a2847] mb-8">
            Legal Intelligence Dashboard
          </h1>

          {error && (
            <Card className="mb-8 border-red-300 bg-red-50">
              <CardContent className="p-4 text-red-700">
                Unable to load dashboard data: {error}
              </CardContent>
            </Card>
          )}

          {/* Welcome Card */}
          <Card className="mb-8 border-l-4 border-[#ff9933]">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#1a2847] rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl text-[#1a2847]">
                      Welcome back, {user?.name ?? 'Guest User'}
                    </h2>
                    <p className="text-gray-600">
                      {user?.email ? user.email : 'Guest session'}
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <p className="text-sm text-gray-600">Profile Completion</p>
                  <Progress value={100} className="w-32 mt-2" />
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <CheckCircle className="w-4 h-4" /> 100% Complete
                  </p>
                  {user && (
                    <button onClick={signOut} className="text-sm text-[#1a2847] hover:text-[#ff9933]">
                      Sign out
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tools & Features */}
          <h2 className="text-2xl text-[#1a2847] mb-6">
            Tools & Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

            <Link to="/tools/ipc-assistant">
              <FeatureCard
                title="IPC Law Assistant"
                icon={<BookOpen className="w-8 h-8" />}
                desc="Search and understand IPC sections with AI-powered explanations."
                color="from-blue-500 to-blue-600"
                linkText="Explore →"
              />
            </Link>

            <Link to="/tools/supreme-court">
              <FeatureCard
                title="Supreme Court Explorer"
                icon={<Gavel className="w-8 h-8" />}
                desc="Search Supreme Court judgments with AI-simplified explanations."
                color="from-purple-500 to-purple-600"
                linkText="Explore →"
              />
            </Link>

            <Link to="/analytics/women-crimes">
              <FeatureCard
                title="Women Crimes Analytics"
                icon={<BarChart3 className="w-8 h-8" />}
                desc="Visualize crimes against women using NCRB data."
                color="from-pink-500 to-pink-600"
                linkText="View Analytics →"
              />
            </Link>

            <Link to="/tools/case-predictor">
              <FeatureCard
                title="Case Outcome Predictor"
                icon={<Brain className="w-8 h-8" />}
                desc="Educational AI model for predicting case outcomes."
                color="from-indigo-500 to-indigo-600"
                linkText="Try It →"
              />
            </Link>

            <Link to="/tools/chat-assistant">
              <FeatureCard
                title="Legal Chat Assistant"
                icon={<MessageCircle className="w-8 h-8" />}
                desc="Chat with the assistant in English or Hindi with citations."
                color="from-slate-500 to-slate-700"
                linkText="Open Chat →"
              />
            </Link>

            <Link to="/tools/document-generator">
              <FeatureCard
                title="Document Generator"
                icon={<FileText className="w-8 h-8" />}
                desc="Generate FIRs and complaint letters with PDF export."
                color="from-teal-500 to-cyan-600"
                linkText="Generate →"
              />
            </Link>

            {/* 🔥 LEGAL AWARENESS – FIXED */}
            <Link to="/legal-awareness">
              <FeatureCard
                title="Legal Awareness"
                icon={<Shield className="w-8 h-8" />}
                desc="Know Your Rights, FAQs, and essential legal information."
                color="from-green-500 to-green-600"
                linkText="Explore →"
              />
            </Link>

            {/* IPC Trends */}
            <Link to="/analytics/ipc-trends">
              <FeatureCard
                title="Crime Trends (IPC)"
                icon={<TrendingUp className="w-8 h-8" />}
                desc="State-wise & year-wise IPC crime analytics dashboard."
                color="from-orange-500 to-orange-600"
                linkText="View Dashboard →"
              />
            </Link>

          </div>

          {/* Quick Stats */}
          <h2 className="text-2xl text-[#1a2847] mb-6">
            Quick Stats
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total IPC Sections" value="511" icon={<BookOpen />} />
            <StatCard title="SC Judgments" value="10,000+" icon={<Gavel />} />
            <StatCard
              title="Crime Reports"
              value={loading ? 'Loading…' : totalCrimeReports.toLocaleString()}
              icon={<BarChart3 />}
            />
          </div>

          {/* Disclaimer */}
          <Card className="bg-yellow-50 border-2 border-yellow-200">
            <CardContent className="p-6 flex gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <p className="text-sm text-gray-700">
                This platform is for educational purposes only and does not
                constitute legal advice.
              </p>
            </CardContent>
          </Card>

        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function FeatureCard({
  title,
  icon,
  desc,
  color,
  linkText,
}: {
  title: string;
  icon: ReactNode;
  desc: string;
  color: string;
  linkText: string;
}) {
  return (
    <Card className="hover:shadow-xl transition-all transform hover:scale-105 border-2 border-gray-200 h-full cursor-pointer">
      <CardHeader className={`bg-gradient-to-br ${color} text-white`}>
        <div className="flex items-center gap-3">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-gray-600 mb-4">{desc}</p>
        <div className="text-sm font-medium text-gray-700">
          {linkText}
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl text-[#1a2847] mt-2">{value}</p>
        </div>
        <div className="w-12 h-12 text-blue-500">{icon}</div>
      </CardContent>
    </Card>
  );
}
