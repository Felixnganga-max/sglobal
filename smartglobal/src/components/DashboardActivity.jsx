import React, { useState, useEffect, useCallback } from "react";
import {
  Activity as ActivityIcon,
  Users,
  ShoppingCart,
  BookOpen,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { activityApi } from "../api/activityApi";

/**
 * DashboardActivity.jsx - Anonymous visitor activity log
 * Shows what anonymous visitors are doing on the site (adding to cart,
 * reading blog posts) under a friendly generated name — no accounts,
 * no personal data collected.
 */

function timeAgo(dateString) {
  if (!dateString) return "";
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

const ACTION_META = {
  add_to_cart: { label: "Added to cart", icon: ShoppingCart, color: "bg-[#BF1A1A]" },
  read_blog: { label: "Read a blog post", icon: BookOpen, color: "bg-[#7B4019]" },
};

const FILTERS = [
  { id: "all", label: "All Activity" },
  { id: "add_to_cart", label: "Add to Cart" },
  { id: "read_blog", label: "Blog Reads" },
];

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-none p-6 border-2 border-gray-100 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-11 h-11 rounded-none flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="text-3xl font-black text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600 font-semibold">{label}</div>
    </div>
  );
}

export default function DashboardActivity() {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, logsRes] = await Promise.all([
        activityApi.getStats(),
        activityApi.getLogs({
          limit: 100,
          ...(filter !== "all" && { action: filter }),
        }),
      ]);
      setStats(statsRes.data);
      setLogs(logsRes.data || []);
    } catch (err) {
      setError(err.message || "Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-4xl font-black text-[#BF1A1A] mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              USER ACTIVITY
            </h1>
            <p className="text-gray-600">
              What anonymous visitors are doing on the site, in real time
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 bg-[#BF1A1A] hover:bg-[#8B1414] text-white px-6 py-3 rounded-none font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={ActivityIcon}
            label="Total Events"
            value={stats ? stats.totalEvents.toLocaleString() : "—"}
            color="bg-gray-800"
          />
          <StatCard
            icon={Users}
            label="Unique Visitors"
            value={stats ? stats.uniqueVisitors.toLocaleString() : "—"}
            color="bg-blue-600"
          />
          <StatCard
            icon={ShoppingCart}
            label="Add to Cart"
            value={stats ? stats.addToCart.toLocaleString() : "—"}
            color="bg-[#BF1A1A]"
          />
          <StatCard
            icon={BookOpen}
            label="Blog Reads"
            value={stats ? stats.readBlog.toLocaleString() : "—"}
            color="bg-[#7B4019]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-none text-sm font-bold transition-colors ${
                filter === f.id
                  ? "bg-[#BF1A1A] text-white"
                  : "bg-white text-gray-600 border-2 border-gray-200 hover:border-[#BF1A1A]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#BF1A1A]" />
          </div>
        )}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-none p-4 flex items-start gap-3 mb-6">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-900 mb-1">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-red-600 text-white rounded-none text-sm font-bold hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Log list */}
        {!loading && !error && logs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-none border-2 border-dashed border-gray-300">
            <ActivityIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No activity yet
            </h3>
            <p className="text-gray-600">
              Visitor actions will start showing up here as people browse the
              site.
            </p>
          </div>
        )}
        {!loading && !error && logs.length > 0 && (
          <div className="bg-white rounded-none shadow-xl border-2 border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Visitor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      When
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {logs.map((log) => {
                    const meta = ACTION_META[log.action] || ACTION_META.add_to_cart;
                    const Icon = meta.icon;
                    return (
                      <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900">
                            {log.anonName}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 text-white text-xs font-bold rounded-none ${meta.color}`}
                          >
                            <Icon size={13} />
                            {meta.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {log.targetTitle || "—"}
                          {log.action === "add_to_cart" && log.meta?.qty > 1 && (
                            <span className="text-gray-400"> × {log.meta.qty}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {timeAgo(log.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
