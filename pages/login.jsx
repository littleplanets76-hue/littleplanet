import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { FaEye, FaEyeSlash, FaLock, FaUser, FaGoogle, FaFacebook } from "react-icons/fa";
import { getUserFromRequest } from "@/lib/auth";

export async function getServerSideProps(context) {
  const user = await getUserFromRequest(context.req);

  if (user) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return { props: {} };
}

function Illustration() {
  return (
    <div className="relative h-96 w-96 overflow-hidden rounded-3xl shadow-2xl">
      <Image
        src="https://static.vecteezy.com/system/resources/previews/035/859/529/non_2x/3d-user-login-form-page-isolated-render-password-hidden-stars-in-sign-in-account-computer-data-protection-security-and-confidentiality-safety-encryption-and-privacy-illustration-vector.jpg"
        alt="Student Login Illustration"
        fill
        className="object-contain brightness-110 contrast-125"
        priority
      />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to sign in");
      }

      await router.replace("/dashboard");
    } catch (loginError) {
      setError(loginError.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 via-blue-50 to-indigo-100">
      <div className="mx-auto min-h-screen max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-screen items-center gap-8 md:grid-cols-2">
          {/* Left side - Illustration */}
          <div className="hidden flex-col items-center justify-center md:flex">
            <Illustration />
          </div>

          {/* Right side - Login Form */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl md:p-12">
              <div className="mb-8">
                <h1 className="text-3xl font-black text-blue-900">School Login</h1>
                <p className="mt-2 text-sm text-slate-600">
                  Stay connected to manage admissions, fees, and operations.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username Field */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700">
                    Username / Email
                  </label>
                  <div className="flex items-center rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-blue-500 focus-within:bg-blue-50">
                    <FaUser className="text-slate-400" />
                    <input
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      className="w-full bg-transparent px-3 py-1 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      placeholder="Enter your username"
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700">
                    Password
                  </label>
                  <div className="flex items-center rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-blue-500 focus-within:bg-blue-50">
                    <FaLock className="text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full bg-transparent px-3 py-1 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="rounded-lg p-2 text-slate-500 transition hover:text-slate-900"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}

                {/* Forgot Password Link */}
                <div className="text-right">
                  <a href="#" className="text-xs font-semibold text-blue-600 transition hover:text-blue-700">
                    Having trouble to sign in?
                  </a>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Login In"}
                </button>
              </form>

          
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
