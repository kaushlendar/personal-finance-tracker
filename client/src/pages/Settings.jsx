
import { useState } from "react";

function Settings({ user, onBack, onLogout }) {
  const [currency, setCurrency] = useState(
    localStorage.getItem("financeCurrency") || "INR"
  );

  const [theme, setTheme] = useState(
    localStorage.getItem("financeTheme") || "light"
  );

  const saveSettings = () => {
    localStorage.setItem("financeCurrency", currency);
    localStorage.setItem("financeTheme", theme);

    alert("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">
        <button
          onClick={onBack}
          className="mb-6 rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
        >
          ← Back
        </button>

        <h1 className="mb-6 text-2xl font-bold">Settings</h1>

        <div className="mb-6 rounded-lg border p-4">
          <h2 className="mb-3 text-lg font-semibold">Profile Settings</h2>
          <p>Name: {user?.name || "User"}</p>
          <p>Email: {user?.email || "Not available"}</p>
        </div>

        <div className="mb-6 rounded-lg border p-4">
          <h2 className="mb-3 text-lg font-semibold">Currency Settings</h2>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-lg border p-3"
          >
            <option value="INR">Indian Rupee (₹)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
          </select>
        </div>

        <div className="mb-6 rounded-lg border p-4">
          <h2 className="mb-3 text-lg font-semibold">Appearance</h2>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full rounded-lg border p-3"
          >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>

        <button
          onClick={saveSettings}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          Save Settings
        </button>

        <div className="mt-8 border-t pt-5">
          <h2 className="mb-3 text-lg font-semibold">Account</h2>

          <button
            onClick={onLogout}
            className="rounded-lg bg-red-600 px-5 py-3 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
