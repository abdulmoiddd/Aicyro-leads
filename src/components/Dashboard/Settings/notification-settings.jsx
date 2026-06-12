import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    leadReceivers: "",
    urgentAlerts: true,
    afterHoursAlerts: false,
    dailySummary: true,
    weeklySummary: false,
  });

  const handleToggle = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Logic to save settings to your backend (e.g., Firebase) goes here
    console.log("Settings saved:", settings);

    // Triggering the success toast with custom styling
    toast.success("Notification settings updated!", {
      style: {
        background: "var(--card-bg)",
        color: "var(--foreground)",
        border: "1px solid var(--border-color)",
      },
      iconTheme: {
        primary: "var(--primary)",
        secondary: "#fff",
      },
    });
  };

  // Reusable Toggle Switch Component
  const ToggleSwitch = ({ label, description, isChecked, onToggle }) => (
    <div className="flex items-center justify-between py-4 border-b border-[var(--border-color)] last:border-0">
      <div className="flex flex-col pr-4">
        <span className="text-sm font-medium text-[var(--foreground)]">
          {label}
        </span>
        {description && (
          <span className="text-sm text-[var(--foreground-muted)] mt-1">
            {description}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`${
          isChecked
            ? "bg-[var(--primary)]"
            : "bg-[var(--foreground-muted)] opacity-50"
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)]`}
        role="switch"
        aria-checked={isChecked}
      >
        <span
          aria-hidden="true"
          className={`${
            isChecked ? "translate-x-5" : "translate-x-0"
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative">
      {/* Toaster Component - Renders the actual popup */}
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="max-w-3xl mx-auto">
        <div className="bg-[var(--card-bg)] rounded-xl shadow-lg shadow-[var(--spotlight-opacity)] border border-[var(--border-color)] overflow-hidden transition-colors duration-300">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[var(--border-color)] bg-[var(--card-bg)]">
            <h2 className="text-xl font-semibold leading-6 text-[var(--foreground)]">
              Notification Settings
            </h2>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Manage how and when you receive alerts for new leads and system
              updates.
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSave} className="px-6 py-5 sm:p-6">
            {/* Lead Alert Receivers Input */}
            <div className="mb-6 pb-6 border-b border-[var(--border-color)]">
              <label
                htmlFor="receivers"
                className="block text-sm font-medium text-[var(--foreground)] mb-2"
              >
                Who receives new lead alerts
              </label>
              <p className="text-sm text-[var(--foreground-muted)] mb-3">
                Enter email addresses separated by commas.
              </p>
              <input
                type="text"
                name="receivers"
                id="receivers"
                value={settings.leadReceivers}
                onChange={(e) =>
                  setSettings({ ...settings, leadReceivers: e.target.value })
                }
                placeholder="e.g., admin@example.com, sales@example.com"
                className="block w-full rounded-md border-0 py-2.5 px-3 bg-[var(--background)] text-[var(--foreground)] shadow-sm ring-1 ring-inset ring-[var(--border-color)] placeholder:text-[var(--foreground-muted)] focus:ring-2 focus:ring-inset focus:ring-[var(--primary)] sm:text-sm sm:leading-6 transition-all"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-2">
              <ToggleSwitch
                label="Urgent lead alerts"
                description="Get notified immediately when a high-priority lead is captured."
                isChecked={settings.urgentAlerts}
                onToggle={() => handleToggle("urgentAlerts")}
              />

              <ToggleSwitch
                label="After-hours alerts"
                description="Receive notifications for leads captured outside of standard business hours."
                isChecked={settings.afterHoursAlerts}
                onToggle={() => handleToggle("afterHoursAlerts")}
              />

              <ToggleSwitch
                label="Daily summary"
                description="Receive a digest of all leads captured at the end of each day."
                isChecked={settings.dailySummary}
                onToggle={() => handleToggle("dailySummary")}
              />

              <ToggleSwitch
                label="Weekly summary"
                description="Get a comprehensive report of lead activity every week."
                isChecked={settings.weeklySummary}
                onToggle={() => handleToggle("weeklySummary")}
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end gap-x-3">
              <button
                type="button"
                className="rounded-md bg-[var(--card-bg)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] shadow-sm ring-1 ring-inset ring-[var(--border-color)] hover:bg-[var(--background)] transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] transition-colors duration-200"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
