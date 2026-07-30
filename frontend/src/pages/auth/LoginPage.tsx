import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login as loginRequest } from "../../services/authService";
import { useAuth } from "../../hooks/useauth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await loginRequest({
        phone,
        password,
      });

      login(response.access_token, {
        user_id: response.user_id,
        username: response.username ?? "",
      });

      navigate("/");
    } catch (error) {
      console.error(error);
      setError("Invalid phone number or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.18),transparent_38%),linear-gradient(135deg,_var(--app-surface)_0%,_var(--app-surface-secondary)_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border-[var(--app-border)] bg-[var(--app-surface)] shadow-[var(--shadow-lg)] backdrop-blur xl:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center bg-gradient-to-br from-[var(--app-surface-secondary)] via-[var(--app-surface)] to-[var(--app-surface-secondary)] p-8 sm:p-10 lg:p-14">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-300">
              <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
              Secure workspace access
            </div>

            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-[var(--app-strong)] sm:text-4xl">
              Corpus Nexus AI
            </h1>
            <p className="mt-3 text-lg text-[var(--app-text-muted)]">
              Unified Corpus Client Platform
            </p>
            <p className="mt-6 max-w-md text-base leading-7 text-[var(--app-text-soft)]">
              Sign in to continue to your corpus operations, insights, and contributor workflows.
            </p>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-md rounded-[24px] border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-6 shadow-[var(--shadow-md)] sm:p-8">
              <h2 className="text-2xl font-semibold text-[var(--app-strong)]">Welcome back</h2>
              <p className="mt-2 text-sm text-[var(--app-text-muted)]">
                Access your Corpus Nexus workspace.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-[var(--app-text-muted)]"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    placeholder="+91**********"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] caret-blue-500 shadow-inner outline-none transition focus:border-violet-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-[var(--app-text-muted)]"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] caret-blue-500 shadow-inner outline-none transition focus:border-violet-500"
                    required
                  />
                </div>

                {error && <p className="text-sm text-rose-400">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-violet-600 py-3 font-semibold text-[var(--app-surface)] transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-violet-400"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>

                <p className="text-center text-sm text-[var(--app-text-muted)]">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-violet-300 transition hover:text-violet-200"
                  >
                    Forgot Password?
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
