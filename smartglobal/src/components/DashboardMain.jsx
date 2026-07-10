import React, { useState, useEffect } from "react";
import {
  Package,
  BookOpen,
  FileText,
  DollarSign,
  Eye,
  ShoppingCart,
  MapPin,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { productService } from "../api/productService";
import { recipeApi } from "../api/recipeApi";
import { blogApi } from "../api/blogApi";
import { API_BASE_URL } from "../api/config";

/**
 * DashboardMain Component
 * Overview statistics and activity — pulled live from the backend.
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
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

const currency = (n) =>
  `KSh ${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-none p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-500 mb-2">{label}</p>
          <p
            className="text-3xl font-black text-gray-900 truncate"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {value}
          </p>
          {sub && (
            <p className="mt-2 text-xs font-semibold text-gray-400">{sub}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-none flex items-center justify-center flex-shrink-0 ${color}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-none p-6 border border-gray-200 animate-pulse">
      <div className="h-4 w-24 bg-gray-100 mb-3" />
      <div className="h-8 w-16 bg-gray-100" />
    </div>
  );
}

function RecentActivity({ activities, loading }) {
  return (
    <div className="bg-white rounded-none p-6 border border-gray-200">
      <h3
        className="text-xl font-black text-gray-900 mb-4"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        Recent Activity
      </h3>
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-[#BF1A1A]" />
        </div>
      ) : activities.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">
          Nothing yet — new products, recipes, posts and orders will show up
          here.
        </p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div
                className={`w-10 h-10 rounded-none flex items-center justify-center flex-shrink-0 ${activity.color}`}
              >
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {activity.description}
                </p>
              </div>
              <div className="text-xs text-gray-400 flex-shrink-0">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QuickActions({ onNavigate }) {
  const actions = [
    {
      label: "Add Product",
      icon: Package,
      color: "bg-[#BF1A1A]",
      hoverColor: "hover:bg-[#8B1414]",
      tab: "products",
    },
    {
      label: "New Recipe",
      icon: BookOpen,
      color: "bg-[#FFD41D]",
      hoverColor: "hover:bg-[#E5BE1A]",
      textColor: "text-black",
      tab: "recipes",
    },
    {
      label: "Write Blog",
      icon: FileText,
      color: "bg-[#7B4019]",
      hoverColor: "hover:bg-[#5A2F13]",
      tab: "blogs",
    },
    {
      label: "Manage Zones",
      icon: MapPin,
      color: "bg-gray-800",
      hoverColor: "hover:bg-gray-900",
      tab: "zones",
    },
  ];

  return (
    <div className="bg-white rounded-none p-6 border border-gray-200">
      <h3
        className="text-xl font-black text-gray-900 mb-4"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => onNavigate?.(action.tab)}
              className={`${action.color} ${action.hoverColor} ${action.textColor || "text-white"} rounded-none p-4 flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-sm font-bold">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardMain({ user, onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      const [productStatsRes, recentProductsRes, recipesRes, blogsRes, orderStatsRes] =
        await Promise.allSettled([
          productService.getProductStats(),
          productService.getAllProducts({
            sortBy: "createdAt",
            order: "desc",
            limit: 3,
          }),
          recipeApi.getAllRecipes({ limit: 100 }),
          blogApi.getAllBlogs({ limit: 100 }),
          fetch(`${API_BASE_URL}/orders/stats`, { headers: authHeaders }).then(
            (r) => r.json(),
          ),
        ]);

      const productOverview =
        productStatsRes.status === "fulfilled"
          ? productStatsRes.value?.data?.overview
          : null;
      const recentProducts =
        recentProductsRes.status === "fulfilled"
          ? recentProductsRes.value?.data || []
          : [];
      const recipes =
        recipesRes.status === "fulfilled" ? recipesRes.value : null;
      const blogs = blogsRes.status === "fulfilled" ? blogsRes.value : null;
      const orderData =
        orderStatsRes.status === "fulfilled" && orderStatsRes.value?.success
          ? orderStatsRes.value.data
          : null;

      const recipeViews = (recipes?.data || []).reduce(
        (sum, r) => sum + (r.views || 0),
        0,
      );
      const blogViews = (blogs?.data || []).reduce(
        (sum, b) => sum + (b.views || 0),
        0,
      );

      setStats({
        totalProducts: productOverview?.totalProducts ?? 0,
        inStockProducts: productOverview?.inStockProducts ?? 0,
        totalRecipes: recipes?.total ?? 0,
        totalBlogs: blogs?.total ?? 0,
        totalViews: recipeViews + blogViews,
        totalOrders: orderData?.overview?.totalOrders ?? 0,
        pendingOrders: orderData?.overview?.pendingOrders ?? 0,
        totalRevenue: orderData?.overview?.totalRevenue ?? 0,
      });

      // Build one real activity feed out of the most recent product,
      // recipe, blog and order records — no fabricated entries.
      const items = [];
      recentProducts.forEach((p) =>
        items.push({
          date: p.createdAt,
          color: "bg-[#BF1A1A]",
          icon: <Package className="h-5 w-5 text-white" />,
          title: "New product added",
          description: p.title,
        }),
      );
      (recipes?.data || []).slice(0, 3).forEach((r) =>
        items.push({
          date: r.createdAt,
          color: "bg-[#FFD41D]",
          icon: <BookOpen className="h-5 w-5 text-black" />,
          title: "Recipe published",
          description: r.title,
        }),
      );
      (blogs?.data || []).slice(0, 3).forEach((b) =>
        items.push({
          date: b.createdAt,
          color: "bg-[#7B4019]",
          icon: <FileText className="h-5 w-5 text-white" />,
          title: "Blog post published",
          description: b.title,
        }),
      );
      (orderData?.recentOrders || []).forEach((o) =>
        items.push({
          date: o.createdAt,
          color: "bg-green-600",
          icon: <ShoppingCart className="h-5 w-5 text-white" />,
          title: o.status === "complete" ? "Order completed" : "Order received",
          description: `${o.customer?.name || "Customer"} — ${currency(o.totalPrice)}`,
        }),
      );

      items.sort((a, b) => new Date(b.date) - new Date(a.date));
      setActivities(
        items.slice(0, 6).map((item) => ({ ...item, time: timeAgo(item.date) })),
      );

      const allFailed = [
        productStatsRes,
        recentProductsRes,
        recipesRes,
        blogsRes,
        orderStatsRes,
      ].every((r) => r.status === "rejected");
      if (allFailed) {
        setError("Couldn't reach the backend to load dashboard data.");
      }
    } catch (err) {
      setError(err.message || "Failed to load dashboard overview");
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats
    ? [
        {
          icon: Package,
          label: "Total Products",
          value: stats.totalProducts.toLocaleString(),
          sub: `${stats.inStockProducts} in stock`,
          color: "bg-[#BF1A1A]",
        },
        {
          icon: BookOpen,
          label: "Recipes",
          value: stats.totalRecipes.toLocaleString(),
          color: "bg-[#FFD41D]",
        },
        {
          icon: FileText,
          label: "Blog Posts",
          value: stats.totalBlogs.toLocaleString(),
          color: "bg-[#7B4019]",
        },
        {
          icon: Eye,
          label: "Total Views",
          value: stats.totalViews.toLocaleString(),
          sub: "Recipes + blog posts",
          color: "bg-green-600",
        },
        {
          icon: ShoppingCart,
          label: "Total Orders",
          value: stats.totalOrders.toLocaleString(),
          sub: `${stats.pendingOrders} pending`,
          color: "bg-blue-600",
        },
        {
          icon: DollarSign,
          label: "Revenue",
          value: currency(stats.totalRevenue),
          sub: "From completed orders",
          color: "bg-purple-600",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-4xl font-black text-gray-900 mb-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Dashboard Overview
        </h1>
        <p className="text-gray-600 font-semibold">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
          Here's what's happening with your store.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-none p-4 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 flex-1">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? [...Array(6)].map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map((stat, index) => <StatCard key={index} {...stat} />)}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} loading={loading} />
        </div>
        <div>
          <QuickActions onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}
