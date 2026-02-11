import React from "react";
import {
  TrendingUp,
  Package,
  BookOpen,
  FileText,
  Users,
  DollarSign,
  Eye,
  ShoppingCart,
} from "lucide-react";

/**
 * DashboardMain Component
 * Overview statistics and charts for Smart Global Dashboard
 */

function StatCard({ icon: Icon, label, value, change, color }) {
  const isPositive = change && change > 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-500 mb-2">{label}</p>
          <p
            className="text-3xl font-black text-gray-900"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {value}
          </p>
          {change && (
            <div
              className={`mt-2 inline-flex items-center gap-1 text-sm font-bold ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              <TrendingUp
                className={`h-4 w-4 ${!isPositive && "rotate-180"}`}
              />
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function RecentActivity({ activities }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h3
        className="text-xl font-black text-gray-900 mb-4"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.color}`}
            >
              {activity.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">
                {activity.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {activity.description}
              </p>
            </div>
            <div className="text-xs text-gray-400">{activity.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    {
      label: "Add Product",
      icon: Package,
      color: "bg-[#BF1A1A]",
      hoverColor: "hover:bg-[#8B1414]",
    },
    {
      label: "New Recipe",
      icon: BookOpen,
      color: "bg-[#FFD41D]",
      hoverColor: "hover:bg-[#E5BE1A]",
      textColor: "text-black",
    },
    {
      label: "Write Blog",
      icon: FileText,
      color: "bg-[#7B4019]",
      hoverColor: "hover:bg-[#5A2F13]",
    },
    {
      label: "View Orders",
      icon: ShoppingCart,
      color: "bg-gray-800",
      hoverColor: "hover:bg-gray-900",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
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
              className={`${action.color} ${action.hoverColor} ${action.textColor || "text-white"} rounded-xl p-4 flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg`}
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

export default function DashboardMain() {
  const stats = [
    {
      icon: Package,
      label: "Total Products",
      value: "247",
      change: 12,
      color: "bg-[#BF1A1A]",
    },
    {
      icon: BookOpen,
      label: "Active Recipes",
      value: "89",
      change: 8,
      color: "bg-[#FFD41D]",
    },
    {
      icon: FileText,
      label: "Blog Posts",
      value: "156",
      change: 15,
      color: "bg-[#7B4019]",
    },
    {
      icon: Eye,
      label: "Total Views",
      value: "45.2K",
      change: 23,
      color: "bg-green-600",
    },
    {
      icon: Users,
      label: "Active Users",
      value: "1,234",
      change: 5,
      color: "bg-blue-600",
    },
    {
      icon: DollarSign,
      label: "Revenue",
      value: "$12.4K",
      change: -3,
      color: "bg-purple-600",
    },
  ];

  const recentActivities = [
    {
      icon: <Package className="h-5 w-5 text-white" />,
      title: "New product added",
      description: "Kent Vegetable Soup Mix added to inventory",
      time: "2 hours ago",
      color: "bg-[#BF1A1A]",
    },
    {
      icon: <BookOpen className="h-5 w-5 text-black" />,
      title: "Recipe updated",
      description: "Pancake recipe images updated",
      time: "5 hours ago",
      color: "bg-[#FFD41D]",
    },
    {
      icon: <FileText className="h-5 w-5 text-white" />,
      title: "Blog post published",
      description: "10 Ways to Use Our Toppings",
      time: "1 day ago",
      color: "bg-[#7B4019]",
    },
    {
      icon: <ShoppingCart className="h-5 w-5 text-white" />,
      title: "New order received",
      description: "Order #1247 - $87.50",
      time: "2 days ago",
      color: "bg-green-600",
    },
  ];

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
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity activities={recentActivities} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
