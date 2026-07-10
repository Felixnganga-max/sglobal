import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ShieldAlert,
} from "lucide-react";
import { API_BASE_URL } from "../api/config";

const AUTH_URL = `${API_BASE_URL}/auth`;

/**
 * DashboardSettings Component
 * Every control here is wired to a real backend field/endpoint — nothing
 * here is decorative. Sections that had no honest, safely-buildable backing
 * (2FA, session timeout, dark mode/compact view theming, brand color
 * picker, "delete all data") were removed rather than left as fake toggles.
 */

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function SettingSection({ title, description, children }) {
  return (
    <div className="bg-white rounded-none p-6 border border-gray-200">
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
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-none focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
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
        type="button"
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

function InlineStatus({ error, success }) {
  if (!error && !success) return null;
  return (
    <div
      className={`flex items-center gap-2 text-xs font-bold ${
        error ? "text-red-600" : "text-green-600"
      }`}
    >
      {error ? (
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
      ) : (
        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
      )}
      {error || success}
    </div>
  );
}

export default function DashboardSettings({ user, onUserUpdate }) {
  const navigate = useNavigate();

  // Profile
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(null);

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifError, setNotifError] = useState(null);
  const [notifSuccess, setNotifSuccess] = useState(null);

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFullName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setCompany(user.company || "");
    const prefs = user.notificationPreferences || {};
    setEmailNotifications(prefs.emailNotifications ?? true);
    setOrderUpdates(prefs.orderUpdates ?? true);
    setMarketingEmails(prefs.marketingEmails ?? false);
    setWeeklyReports(prefs.weeklyReports ?? true);
  }, [user]);

  const syncLocalUser = (updated) => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, ...updated }));
    } catch {
      // Non-fatal — the next /me fetch will still pick up the real state.
    }
  };

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileError(null);
    setProfileSuccess(null);
    try {
      const res = await fetch(`${AUTH_URL}/updatedetails`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ name: fullName, email, phone, company }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to save");
      syncLocalUser(data.data);
      onUserUpdate?.();
      setProfileSuccess("Profile updated.");
    } catch (err) {
      setProfileError(err.message || "Failed to save profile");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setNotifSaving(true);
    setNotifError(null);
    setNotifSuccess(null);
    try {
      const res = await fetch(`${AUTH_URL}/updatedetails`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          notificationPreferences: {
            emailNotifications,
            orderUpdates,
            marketingEmails,
            weeklyReports,
          },
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to save");
      syncLocalUser(data.data);
      onUserUpdate?.();
      setNotifSuccess("Notification preferences saved.");
    } catch (err) {
      setNotifError(err.message || "Failed to save preferences");
    } finally {
      setNotifSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);
    if (!currentPassword || !newPassword) {
      setPasswordError("Enter your current and new password.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setPasswordSaving(true);
    try {
      const res = await fetch(`${AUTH_URL}/updatepassword`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to change password");
      if (data.token) localStorage.setItem("token", data.token);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setPasswordSuccess("Password changed.");
    } catch (err) {
      setPasswordError(err.message || "Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (
      !window.confirm(
        "Deactivate your account? You will be logged out immediately and won't be able to sign back in until an admin reactivates it. This cannot be undone by yourself.",
      )
    )
      return;
    setDeactivating(true);
    try {
      const res = await fetch(`${AUTH_URL}/deactivate`, {
        method: "PUT",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to deactivate");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      alert(err.message || "Failed to deactivate account");
      setDeactivating(false);
    }
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <SettingSection
          title="Profile Settings"
          description="Update your personal information"
        >
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#BF1A1A] to-[#7B4019] flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0">
              {(fullName || "SG")
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <p className="text-xs text-gray-500">
              Your initials are shown here based on your name below.
            </p>
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
            placeholder="+254 700 000 000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <InputField
            label="Company"
            placeholder="Your company name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          <InlineStatus error={profileError} success={profileSuccess} />

          <button
            onClick={handleSaveProfile}
            disabled={profileSaving}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#BF1A1A] to-[#8B1414] text-white rounded-none font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {profileSaving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            {profileSaving ? "Saving..." : "Save Changes"}
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
            onChange={() => setEmailNotifications((v) => !v)}
          />
          <ToggleSwitch
            label="Order Updates"
            description="Get notified about order status changes"
            enabled={orderUpdates}
            onChange={() => setOrderUpdates((v) => !v)}
          />
          <ToggleSwitch
            label="Marketing Emails"
            description="Receive promotional emails and offers"
            enabled={marketingEmails}
            onChange={() => setMarketingEmails((v) => !v)}
          />
          <ToggleSwitch
            label="Weekly Reports"
            description="Get weekly performance summaries"
            enabled={weeklyReports}
            onChange={() => setWeeklyReports((v) => !v)}
          />

          <InlineStatus error={notifError} success={notifSuccess} />

          <button
            onClick={handleSaveNotifications}
            disabled={notifSaving}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-none font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {notifSaving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            {notifSaving ? "Saving..." : "Save Preferences"}
          </button>
        </SettingSection>

        {/* Security Settings */}
        <SettingSection
          title="Security"
          description="Change your password or deactivate your account"
        >
          <div className="grid grid-cols-1 gap-3">
            <InputField
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <InputField
              label="New Password"
              type="password"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <InputField
              label="Confirm New Password"
              type="password"
              placeholder="Re-enter new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>

          <InlineStatus error={passwordError} success={passwordSuccess} />

          <button
            onClick={handleChangePassword}
            disabled={passwordSaving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-none font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {passwordSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="h-4 w-4" />
            )}
            {passwordSaving ? "Updating..." : "Change Password"}
          </button>

          <div className="pt-4 mt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-3">
              Deactivating your account signs you out immediately and blocks
              future logins until an admin reactivates it.
            </p>
            <button
              onClick={handleDeactivate}
              disabled={deactivating}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-none font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              {deactivating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldAlert className="h-4 w-4" />
              )}
              {deactivating ? "Deactivating..." : "Deactivate Account"}
            </button>
          </div>
        </SettingSection>
      </div>
    </div>
  );
}
