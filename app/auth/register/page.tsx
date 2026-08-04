"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    registerNumber: "",
    department: "",
    year: "",
    section: "",
    gender: "",
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
          // Format zod errors
          const firstError = Object.values(data.details.fieldErrors)[0] as string[];
          setError(firstError?.[0] || "Invalid data provided");
        } else {
          setError(data.error || "Registration failed");
        }
      } else {
        setSuccess(true);
        // Redirect to login instead of automatically signing in
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden px-4 py-12">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#3F6FB5]/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#F4B400]/10 blur-[150px] rounded-full" />
      </div>

      <div className="z-10 w-full max-w-xl">
        <Link href="/auth/login" className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card rounded-2xl p-8 border-t-4 border-t-[#F4B400] shadow-2xl bg-white/5 backdrop-blur-xl border-white/10"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Create Account</h1>
            <p className="text-slate-400 text-sm">Register as a participant for STREAKATHON.</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm font-medium">{error}</div>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm font-medium">Registration successful! Redirecting to login...</div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-200">I am registering as</label>
                <div className="flex gap-6 mt-1">
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="role" 
                      value="PARTICIPANT" 
                      checked={formData.role === "PARTICIPANT"} 
                      onChange={handleChange} 
                      className="accent-[#F4B400] w-4 h-4" 
                    />
                    Student Participant
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="role" 
                      value="AMBASSADOR" 
                      checked={formData.role === "AMBASSADOR"} 
                      onChange={handleChange} 
                      className="accent-[#F4B400] w-4 h-4" 
                    />
                    Ambassador
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B400] transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">Register Number</label>
                <input
                  type="text"
                  name="registerNumber"
                  required
                  value={formData.registerNumber}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B400] transition-all"
                  placeholder="732921IT101"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-200">College Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B400] transition-all"
                  placeholder="student@sonatech.ac.in"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">Department</label>
                <select
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B400] transition-all [&>option]:bg-slate-900"
                >
                  <option value="" disabled>Select Dept</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                  <option value="AIDS">AI&DS</option>
                  <option value="AIML">AI&ML</option>
                  <option value="MCT">Mechatronics</option>
                  <option value="BME">BME</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">Year</label>
                <select
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B400] transition-all [&>option]:bg-slate-900"
                >
                  <option value="" disabled>Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">Section <span className="text-slate-500 font-normal">(Optional)</span></label>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B400] transition-all"
                  placeholder="e.g. A"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">Gender</label>
                <select
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B400] transition-all [&>option]:bg-slate-900"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B400] transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B400] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full flex items-center justify-center h-12 rounded-xl bg-[#F4B400] text-black px-4 py-2 text-sm font-bold shadow-[0_0_20px_rgba(244,180,0,0.3)] hover:shadow-[0_0_25px_rgba(244,180,0,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
