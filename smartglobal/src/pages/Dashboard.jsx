import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";
import {
  LayoutDashboard,
  Package,
  BookOpen,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";

// Import tab components
import DashboardMain from "../components/DashboardMain";
import DashboardProducts from "../components/DashboardProducts";
import DashboardRecipes from "../components/Dashboardrecipes";
import DashboardBlogs from "../components/Dashboardblogs";
import DashboardSettings from "../components/Dashboardsettings";
import ZoneManager from "../components/ZoneManager";

const API_URL = "https://sglobal-plf6.vercel.app/smartglobal/auth";

function Sidebar({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
  user,
  onLogout,
}) {
  const navItems = [
    { id: "main", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "recipes", label: "Recipes", icon: BookOpen },
    { id: "blogs", label: "Blogs", icon: FileText },
    { id: "zones", label: "Zones", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "SG";
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-[#BF1A1A] blur-xl opacity-20 rounded-full"></div>
                <img
                  src={assets.logo}
                  alt="Smart Global"
                  className="h-10 w-auto relative z-10"
                />
              </div>
              <div>
                <div
                  className="text-lg font-black text-gray-900 tracking-tighter"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  SMART GLOBAL
                </div>
                <div className="text-[9px] text-gray-500 font-bold tracking-wider -mt-1">
                  DASHBOARD
                </div>
              </div>
            </a>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#BF1A1A] to-[#7B4019] flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user ? getInitials(user.name) : "SG"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-gray-900 truncate">
                {user ? user.name : "Loading..."}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {user ? user.email : ""}
              </div>
              {user && (
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      user.role === "admin"
                        ? "bg-[#BF1A1A] text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {user.role.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-[#BF1A1A] to-[#8B1414] text-white shadow-lg shadow-[#BF1A1A]/30"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${isActive ? "text-[#FFD41D]" : ""}`}
                  />
                  <span
                    className="font-bold text-sm"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-[#BF1A1A] transition-all duration-300"
          >
            <LogOut className="h-5 w-5" />
            <span
              className="font-bold text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Log Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("main");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        // No token found, redirect to login
        navigate("/");
        return;
      }

      // Fetch user data from API
      const response = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);

      // If token is invalid or expired, redirect to login
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        // Try to use stored user data as fallback
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          navigate("/login");
        }
        setLoading(false);
      }
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      // Call logout API
      await axios.get(`${API_URL}/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear localStorage and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  // Render active tab content
  const renderContent = () => {
    switch (activeTab) {
      case "main":
        return <DashboardMain user={user} />;
      case "products":
        return <DashboardProducts />;
      case "recipes":
        return <DashboardRecipes />;
      case "zones":
        return <ZoneManager />;
      case "blogs":
        return <DashboardBlogs />;
      case "settings":
        return <DashboardSettings user={user} onUserUpdate={fetchUserData} />;
      default:
        return <DashboardMain user={user} />;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#BF1A1A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          user={user}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div
                className="text-lg font-black"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                SMART GLOBAL
              </div>
              <div className="flex items-center gap-2">
                {user && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#BF1A1A] to-[#7B4019] flex items-center justify-center text-white font-bold text-xs">
                    {user.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 lg:p-8">{renderContent()}</div>
        </main>
      </div>

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;600;700;800;900&display=swap");
      `}</style>
    </div>
  );
}
