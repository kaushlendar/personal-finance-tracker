import { useState } from "react";

function Profile({ user, onBack, onUpdate }) {
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("financeToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      onUpdate(data.user);
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">

        <button
          onClick={onBack}
          className="mb-6 rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
        >
          ← Back to Dashboard
        </button>

        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          My Profile
        </h1>

        <div className="mb-6 flex items-center gap-4 rounded-lg bg-blue-50 p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
            {(name || "U").charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {name || "User"}
            </h2>
            <p className="text-gray-600">
              {user?.email || "Email not available"}
            </p>
          </div>
        </div>

        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Profile Information
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Email Address
            </label>

            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full rounded-lg border bg-gray-50 p-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {message && (
            <p className="text-sm text-blue-700">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Profile;