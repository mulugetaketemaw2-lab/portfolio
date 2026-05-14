"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* Return to Home Logo with Custom Tooltip */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-100 text-2xl font-bold font-serif tracking-tight text-navy hover:bg-navy hover:text-white hover:scale-110 hover:shadow-xl transition-all duration-300 z-50 group"
      >
        <span>MK<span className="text-orange">.</span></span>
        
        {/* Beautiful Custom Tooltip that slides in on hover */}
        <span className="absolute left-[110%] ml-3 px-4 py-2 bg-navy text-white text-sm font-sans font-medium rounded-xl opacity-0 invisible -translate-x-2 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 transition-all duration-300 shadow-xl whitespace-nowrap before:content-[''] before:absolute before:top-1/2 before:-left-2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-navy pointer-events-none">
          Return to main website
        </span>
      </Link>
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8 bg-navy text-white text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} className="text-orange" />
          </div>
          <h2 className="text-3xl font-bold font-serif mb-2">Admin Access</h2>
          <p className="text-blue-200">Sign in to manage your portfolio</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange focus:border-orange outline-none transition-all text-gray-800"
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange focus:border-orange outline-none transition-all text-gray-800"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 bg-orange text-white rounded-xl font-bold text-lg hover:bg-orange/90 transition-all shadow-lg hover:shadow-orange/30 active:scale-95 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
