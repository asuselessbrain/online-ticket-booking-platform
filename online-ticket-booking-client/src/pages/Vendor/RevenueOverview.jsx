import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { AuthContext } from "../../providers/AuthContext";
import api from "../../lib/axios";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const formatBDT = (value = 0) => {
  return `BDT ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

const SparkBar = ({ value, max, label }) => {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{label}</span>
        <span className="font-semibold text-gray-900">{pct}%</span>
      </div>
      <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#0ea966] via-[#0f8b47] to-[#0c6f34] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const RevenueOverview = () => {
  const { user } = use(AuthContext);
  const [chartData, setChartData] = useState([]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    enabled: !!user?.email,
    queryKey: ["vendorRevenue", user?.email],
    queryFn: async () => {
      const res = await api.get(`/api/v1/bookings/vendor/${user.email}/revenue`);
      const payload = res.data?.data || { totalRevenue: 0, totalTicketsSold: 0, totalTicketsAdded: 0, series: [] };
      setChartData(payload.series || []);
      return payload;
    },
  });

  const stats = useMemo(() => {
    if (!data) return { totalRevenue: 0, totalTicketsSold: 0, totalTicketsAdded: 0 };
    return data;
  }, [data]);

  const maxBar = Math.max(stats.totalRevenue || 0, stats.totalTicketsSold || 0, stats.totalTicketsAdded || 0, 1);

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#01602a]">Revenue</p>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Overview</h1>
          <p className="text-gray-600 mt-2">Track earnings and ticket performance at a glance.</p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
        >
          Refresh
        </button>
      </div>

      {isLoading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-gray-600">Loading revenue...</div>
      )}

      {isError && (
        <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-6 text-amber-700">
          Unable to load revenue data. {error?.message}
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{formatBDT(stats.totalRevenue)}</h2>
            <p className="text-xs text-gray-500 mt-1">From all paid bookings</p>
            <div className="mt-4">
              <SparkBar value={stats.totalRevenue} max={maxBar} label="Revenue share" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-600">Total Tickets Sold</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTicketsSold}</h2>
            <p className="text-xs text-gray-500 mt-1">Across paid bookings</p>
            <div className="mt-4">
              <SparkBar value={stats.totalTicketsSold} max={maxBar} label="Sold volume" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-600">Total Tickets Added</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTicketsAdded}</h2>
            <p className="text-xs text-gray-500 mt-1">Tickets you've created</p>
            <div className="mt-4">
              <SparkBar value={stats.totalTicketsAdded} max={maxBar} label="Inventory" />
            </div>
          </div>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
              <p className="text-sm text-gray-600">Paid bookings over time (BDT)</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea966" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#0ea966" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="sold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip formatter={(value) => [`BDT ${Number(value).toLocaleString()}`, ""]} />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0ea966" fill="url(#rev)" strokeWidth={2} />
                <Area type="monotone" dataKey="tickets" name="Tickets Sold" stroke="#2563eb" fill="url(#sold)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  );
};

export default RevenueOverview;
