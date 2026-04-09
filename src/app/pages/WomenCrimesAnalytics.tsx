import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { apiGet } from "../lib/apiClient";
import type { WomenDashboardResponse } from "../types/api";

export default function WomenCrimesAnalytics() {
  const [years, setYears] = useState<number[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState("");

  const [crimeTotals, setCrimeTotals] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet<WomenDashboardResponse>("/api/women/dashboard")
      .then((data) => {
        setYears(data.available_years);
        setStates(data.available_states);
        setSelectedYear(data.available_years[0]);
        setSelectedState(data.available_states[0]);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedYear || !selectedState) return;

    setLoading(true);

    apiGet<WomenDashboardResponse>(
      `/api/women/dashboard?year=${selectedYear}&state=${encodeURIComponent(selectedState)}`
    )
      .then((data) => {
        setCrimeTotals(data.crime_totals);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [selectedYear, selectedState]);

  /* 🔥 Transform data */
  const crimeArray = Object.entries(crimeTotals)
    .filter(([_, v]) => v > 0)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const top3Crimes = crimeArray.slice(0, 3);

  const COLORS = [
    "#ff6b6b",
    "#ff9f43",
    "#1dd1a1",
    "#54a0ff",
    "#5f27cd",
    "#00d2d3",
    "#e84393",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 w-full px-6 py-10">
        <h1 className="text-3xl text-[#1a2847] mb-2">
          Women Crime Analytics
        </h1>
        <p className="text-gray-600 mb-6">
          Crime distribution by type (State & Year wise)
        </p>

        {error && <p className="text-red-600 mb-4">Failed to load analytics: {error}</p>}

        {/* FILTERS */}
        <div className="flex gap-4 mb-6">
          <select
            className="border p-2 rounded"
            value={selectedYear ?? ""}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            {states.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {loading && <p>Loading analytics...</p>}

        {!loading && (
          <>
            {/* 🔥 TOP 3 CRIMES BAR GRAPH */}
            <Card className="mb-10">
              <CardHeader className="bg-[#1a2847] text-white">
                <CardTitle>
                  Top 3 Crimes – {selectedState} ({selectedYear})
                </CardTitle>
              </CardHeader>
              <CardContent style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={top3Crimes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#ff6b6b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 🔥 PIE – ALL CRIMES */}
            <Card className="mb-10">
              <CardHeader className="bg-[#1a2847] text-white">
                <CardTitle>
                  Crime Type Distribution – {selectedState}
                </CardTitle>
              </CardHeader>
              <CardContent style={{ height: 380 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={crimeArray} dataKey="value" nameKey="name" label>
                      {crimeArray.map((_, i) => (
                        <Cell
                          key={i}
                          fill={COLORS[i % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 🔥 CRIME LIST */}
            <Card>
              <CardHeader>
                <CardTitle>Crime Breakdown (Exact Numbers)</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="min-w-full border text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border px-3 py-2 text-left">Crime</th>
                      <th className="border px-3 py-2 text-right">Cases</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crimeArray.map((c, i) => (
                      <tr key={i}>
                        <td className="border px-3 py-2">{c.name}</td>
                        <td className="border px-3 py-2 text-right">
                          {c.value.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
