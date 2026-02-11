import React, { useState } from "react";
import {
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  CreditCard,
  Mail,
  Shield,
  Save,
} from "lucide-react";

/**
 * DashboardSettings Component
 * Settings and preferences management for Smart Global Dashboard
 */

function SettingSection({ title, description, children }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="mb-4">
        <h3
          className="text-xl font-black text-gray-900"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function InputField({ label, type = "text", placeholder, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
      />
    </div>
  );
}

function ToggleSwitch({ label, description, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-bold text-gray-900">{label}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={onChange}
        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
          enabled ? "bg-[#BF1A1A]" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
            enabled ? "translate-x-7" : ""
          }`}
        />
      </button>
    </div>
  );
}

export default function DashboardSettings() {
  // Profile Settings
  const [fullName, setFullName] = useState("Admin User");
  const [email, setEmail] = useState("admin@smartglobal.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [company, setCompany] = useState("Smart Global");

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);

  // Security Settings
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(true);

  // Appearance Settings
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-4xl font-black text-gray-900 mb-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Settings
        </h1>
        <p className="text-gray-600 font-semibold">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <SettingSection
          title="Profile Settings"
          description="Update your personal information"
        >
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#BF1A1A] to-[#7B4019] flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              SG
            </div>
            <div>
              <button className="px-4 py-2 bg-[#BF1A1A] text-white rounded-lg text-sm font-bold hover:bg-[#8B1414] transition-colors">
                Change Avatar
              </button>
              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
          </div>

          <InputField
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <InputField
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <InputField
            label="Company"
            placeholder="Your company name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#BF1A1A] to-[#8B1414] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Save className="h-5 w-5" />
            Save Changes
          </button>
        </SettingSection>

        {/* Notification Settings */}
        <SettingSection
          title="Notifications"
          description="Manage how you receive notifications"
        >
          <ToggleSwitch
            label="Email Notifications"
            description="Receive notifications via email"
            enabled={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
          />

          <ToggleSwitch
            label="Order Updates"
            description="Get notified about order status changes"
            enabled={orderUpdates}
            onChange={() => setOrderUpdates(!orderUpdates)}
          />

          <ToggleSwitch
            label="Marketing Emails"
            description="Receive promotional emails and offers"
            enabled={marketingEmails}
            onChange={() => setMarketingEmails(!marketingEmails)}
          />

          <ToggleSwitch
            label="Weekly Reports"
            description="Get weekly performance summaries"
            enabled={weeklyReports}
            onChange={() => setWeeklyReports(!weeklyReports)}
          />
        </SettingSection>

        {/* Security Settings */}
        <SettingSection
          title="Security"
          description="Protect your account with security features"
        >
          <ToggleSwitch
            label="Two-Factor Authentication"
            description="Add an extra layer of security"
            enabled={twoFactor}
            onChange={() => setTwoFactor(!twoFactor)}
          />

          <ToggleSwitch
            label="Session Timeout"
            description="Automatically log out after 30 minutes of inactivity"
            enabled={sessionTimeout}
            onChange={() => setSessionTimeout(!sessionTimeout)}
          />

          <div className="pt-4 space-y-3">
            <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors">
              Change Password
            </button>
            <button className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors">
              Deactivate Account
            </button>
          </div>
        </SettingSection>

        {/* Appearance Settings */}
        <SettingSection
          title="Appearance"
          description="Customize how the dashboard looks"
        >
          <ToggleSwitch
            label="Dark Mode"
            description="Switch to dark theme"
            enabled={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />

          <ToggleSwitch
            label="Compact View"
            description="Show more content in less space"
            enabled={compactView}
            onChange={() => setCompactView(!compactView)}
          />

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Brand Color
            </label>
            <div className="flex gap-3">
              {["#BF1A1A", "#FFD41D", "#7B4019", "#4F46E5", "#10B981"].map(
                (color) => (
                  <button
                    key={color}
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                  />
                ),
              )}
            </div>
          </div>
        </SettingSection>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
        <h3
          className="text-xl font-black text-red-900 mb-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Danger Zone
        </h3>
        <p className="text-sm text-red-700 mb-4">
          These actions are irreversible. Please proceed with caution.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors">
            Delete All Data
          </button>
          <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors">
            Close Account
          </button>
        </div>
      </div>
    </div>
  );
}
