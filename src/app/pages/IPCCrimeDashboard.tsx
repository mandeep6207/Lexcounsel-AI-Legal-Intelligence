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
import type { DistrictCrimeRow, IPCDashboardResponse } from "../types/api";

export default function IPCCrimeDashboard() {
  const [years, setYears] = useState<number[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<string>("");

  const [districtData, setDistrictData] = useState<DistrictCrimeRow[]>([]);
  const [crimeTotals, setCrimeTotals] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* 🔹 Load filters */
  useEffect(() => {
    apiGet<Pick<IPCDashboardResponse, "available_years" | "available_states">>("/api/ipc/records")
      .then((data) => {
        setYears(data.available_years);
        setStates(data.available_states);

        if (data.available_years.length)
          setSelectedYear(data.available_years[0]);

        if (data.available_states.length)
          setSelectedState(data.available_states[0]);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  /* 🔹 Load analytics */
  useEffect(() => {
    if (!selectedYear || !selectedState) return;

    setLoading(true);

    Promise.all([
      apiGet<IPCDashboardResponse>(`/api/ipc/dashboard?year=${selectedYear}&state=${encodeURIComponent(selectedState)}`),
      apiGet<DistrictCrimeRow[]>(`/api/ipc/districts?year=${selectedYear}&state=${encodeURIComponent(selectedState)}`),
    ])
      .then(([dashboard, districts]) => {
        setCrimeTotals(dashboard.crime_totals || {});
        setDistrictData(districts || []);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [selectedYear, selectedState]);

  /* 🔹 Pie Data */
  const pieData = Object.entries(crimeTotals)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  const COLORS = [
    "#ff9933",
    "#1a2847",
    "#ff6b6b",
    "#6a5acd",
    "#2ecc71",
    "#e84393",
    "#00cec9",
    "#fdcb6e",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* FULL WIDTH */}
      <div className="flex-1 py-10 w-full px-6">
        <h1 className="text-3xl text-[#1a2847] mb-2">
          IPC Crime Trends Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          District-wise & crime-type IPC analytics (NCRB dataset)
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
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {loading && <p>Loading analytics…</p>}

        {!loading && (
          <>
            {/* 🔥 DISTRICT BAR CHART */}
            <Card className="mb-10">
              <CardHeader className="bg-[#1a2847] text-white">
                <CardTitle>
                  Top Districts by IPC Crimes – {selectedState}
                </CardTitle>
              </CardHeader>
              <CardContent style={{ height: 420 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={districtData.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="DISTRICT" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="TOTAL IPC CRIMES" fill="#ff9933" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 🔥 PIE + CRIME LIST */}
            <Card>
              <CardHeader className="bg-[#1a2847] text-white">
                <CardTitle>
                  Crime Type Distribution – {selectedState}
                </CardTitle>
              </CardHeader>

              <CardContent>
                {/* PIE */}
                <div style={{ height: 360 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={140}
                      >
                        {pieData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={COLORS[i % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* 🔥 BIG CRIME LIST */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                  {pieData.map((crime, index) => (
                    <div
                      key={crime.name}
                      className="flex items-center gap-3 border rounded-lg p-3 bg-gray-50"
                    >
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor:
                            COLORS[index % COLORS.length],
                        }}
                      />
                      <div>
                        <p className="font-semibold text-[#1a2847] text-sm">
                          {crime.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {crime.value.toLocaleString()} cases
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
