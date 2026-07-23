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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.18),transparent_38%),linear-gradient(135deg,_#09090b_0%,_#111827_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-950/70 shadow-2xl shadow-black/30 backdrop-blur xl:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-8 sm:p-10 lg:p-14">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-300">
              <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
              Secure workspace access
            </div>

            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Corpus Nexus AI
            </h1>
            <p className="mt-3 text-lg text-zinc-400">
              Unified Corpus Client Platform
            </p>
            <p className="mt-6 max-w-md text-base leading-7 text-zinc-500">
              Sign in to continue to your corpus operations, insights, and contributor workflows.
            </p>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-md rounded-[24px] border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg shadow-black/20 sm:p-8">
              <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Access your Corpus Nexus workspace.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-700 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 caret-blue-500 shadow-inner outline-none transition focus:border-violet-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-700 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 caret-blue-500 shadow-inner outline-none transition focus:border-violet-500"
                    required
                  />
                </div>

                {error && <p className="text-sm text-rose-400">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-violet-400"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>

                <p className="text-center text-sm text-zinc-500">
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
