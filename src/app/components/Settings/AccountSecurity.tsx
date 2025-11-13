
"use client";

import { useAppStore } from "@/app/stores/useAppStore";
import { useState } from "react";

export default function ProfileSection() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { currentUser } = useAppStore();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔄 handleUpdate called");

    // Check empty fields
    if (!name && !email && !password) {
      setMessage({
        type: "error",
        text: "Please fill at least one field to update",
      });
      return;
    }

    // Require email re-entry if password is being updated
    if (password && confirmEmail.trim() !== currentUser?.email) {
      setMessage({
        type: "error",
        text: "Please re-enter your registered email correctly to verify your identity before updating your password.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/edit-user`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: currentUser?.email, // use stored email for identification
            ...(name && { name }),
            ...(password && { password }),
          }),
        }
      );

      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP Error:", response.status, errorText);
        throw new Error(`Server error: ${response.status}`);
      }

      const res = await response.json();
      console.log("API Response:", res);

      if (res.success) {
        setMessage({ type: "success", text: "Profile updated successfully! Please refresh the page!"});
        setName("");
        setEmail("");
        setPassword("");
        setConfirmEmail("");
      } else {
        setMessage({ type: "error", text: res.message });
      }
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };
  function maskEmail(email: string): string {
    const [local, domain] = email.split("@");
    if (!local || !domain) return email;

    const localLength = local.length;

    if (localLength <= 4) {
      // Too short, show first letter only
      return local[0] + "*".repeat(localLength - 1) + "@" + domain;
    }

    const first = local.slice(0, 3); // first 3 letters
    const last = local.slice(-2); // last 2 letters
    const masked = "*".repeat(localLength - 5); // middle letters

    return `${first}${masked}${last}@${domain}`;
  }

  return (
    <div className="p-6 border border-gray-200 rounded-xl w-full">
      <h2 className="text-[20px] font-medium pb-[40px]">
        Account & Security Settings
      </h2>

      <h2 className="text-[20px] font-semibold mb-4 h-fit">
        Profile Information
      </h2>

      {message && (
        <div
          className={`p-3 rounded-lg mb-4 ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleUpdate}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col">
            <label className="text-[16px] font-medium mb-2">
              Display Name *
            </label>
            <input
              type="text"
              placeholder={currentUser?.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-100 px-4 py-3 rounded-lg text-gray-700 font-medium"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[16px] font-medium mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={maskEmail(currentUser?.email || "")}
              readOnly
              className="bg-gray-100 px-4 py-3 rounded-lg text-gray-500 font-medium"
            />

            <div className="p-3 mt-1 rounded-xl bg-white text-gray-600 border border-gray-200 text-sm">
              Email can&apos;t be changed
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        <h2 className="text-[20px] font-semibold mb-4 font-outfit">Security</h2>

        <div className="flex flex-col mb-6">
          <label className="text-[16px] font-medium mb-2">New Password</label>
          <input
            type="password"
            placeholder="***********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-100 px-4 py-3 rounded-lg text-gray-700 font-medium"
          />
        </div>

        {password && (
          <div className="flex flex-col mb-6">
            <label className="text-[16px] font-medium mb-2">
              Re-enter your email to verify identity
            </label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              className="bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-lg text-gray-700 font-medium"
            />
            <small className="text-yellow-700 mt-2">
              ⚠️ Please verify your email to confirm password change.
            </small>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-primary text-primary font-medium rounded-lg hover:bg-blue-50 transition-all"
        >
          <span className="text-sm">|**</span>
          {loading ? "Updating..." : "Update Account Info"}
        </button>
      </form>
    </div>
  );
}
