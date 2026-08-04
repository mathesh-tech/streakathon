"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, Building2, GraduationCap, Users } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    registerNumber: "",
    department: "IT",
    year: "3",
    section: "A",
    gender: "Male",
    password: "",
    confirmPassword: "",
    role: "PARTICIPANT"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.email.endsWith("@sonatech.ac.in")) {
      setError("Please use your official college email ending with @sonatech.ac.in");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const firstError = Object.values(data.details.fieldErrors)[0] as string[];
          setError(firstError?.[0] || "Invalid registration data");
        } else {
          setError(data.error || "Registration failed");
        }
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden px-4 py-12">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="z-10 w-full max-w-xl">
        <Link href="/auth/login" className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Student Registration</h1>
            <p className="text-slate-400 text-sm">
              Streakathon 2K26 • Student Registration Portal
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-300 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
              <div className="text-sm font-medium">{error}</div>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
              <div className="text-sm font-medium">Registration successful! Redirecting to login...</div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  placeholder="e.g. Vijayaragavan R"
                />
              </div>

              {/* Register Number */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Register Number</label>
                <input
                  type="text"
                  name="registerNumber"
                  required
                  value={formData.registerNumber}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  placeholder="e.g. 6178231IT001"
                />
              </div>

              {/* Email */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">College Email (@sonatech.ac.in)</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  placeholder="student@sonatech.ac.in"
                />
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  Department
                </label>
                <select
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="IT">IT - Information Technology</option>
                  <option value="ADS">ADS - AI & Data Science</option>
                </select>
              </div>

              {/* Year */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  Year of Study
                </label>
                <select
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                </select>
              </div>

              {/* Class / Section */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  Class Section
                </label>
                <select
                  name="section"
                  required
                  value={formData.section}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="A">Class A</option>
                  <option value="B">Class B</option>
                  <option value="C">Class C</option>
                </select>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Gender</label>
                <select
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  placeholder="••••••••"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full flex items-center justify-center h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Complete Student Registration"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
