import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  forgotPasswordInit,
  forgotPasswordConfirm,
} from "../../services/authService";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await forgotPasswordInit(phone);
      setMessage(res.message);
      setStep("otp");
    } catch {
      setError("Failed to send OTP. Check the phone number.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await forgotPasswordConfirm(phone, otp, newPassword, confirmPassword);
      navigate("/login", {
        state: { message: "Password reset successfully. Sign in." },
      });
    } catch {
      setError("Failed to reset password. Check the OTP and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.18),transparent_38%),linear-gradient(135deg,_var(--app-surface)_0%,_var(--app-surface-secondary)_100%)]">
      <div className="w-full max-w-md rounded-xl border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-8 shadow-[var(--shadow-md)]">
        <h1 className="mb-2 text-center text-3xl font-bold text-[var(--app-strong)]">
          Reset Password
        </h1>

        <p className="mb-8 text-center text-[var(--app-text-muted)]">
          {step === "phone"
            ? "Enter your phone number to receive an OTP."
            : "Enter the OTP sent to your phone."}
        </p>

        {message && (
          <p className="mb-4 text-sm text-green-600">{message}</p>
        )}

        {error && (
          <p className="mb-4 text-sm text-red-600">{error}</p>
        )}

        {step === "phone" ? (
          <form onSubmit={handleSendOtp}>
            <div className="mb-5">
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-[var(--app-text-muted)]"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-md border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 py-3 font-medium text-[var(--app-surface)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <div className="mb-5">
              <label
                htmlFor="otp"
                className="mb-2 block text-sm font-medium text-[var(--app-text-muted)]"
              >
                OTP Code
              </label>
              <input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full rounded-md border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-medium text-[var(--app-text-muted)]"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-md border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-[var(--app-text-muted)]"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 py-3 font-medium text-[var(--app-surface)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-[var(--app-text-muted)]">
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
