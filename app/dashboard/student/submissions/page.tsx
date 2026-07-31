"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Github, FileArchive, FileText, Video, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { triggerConfetti } from "@/components/dashboard/student/GamificationSystem";

export default function SubmissionsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      triggerConfetti();
    }, 1500);
  };

  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Project Submission</h1>
        <p className="text-muted-foreground">Submit your project files for the active hackathon.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submission Form */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-3xl p-6 md:p-8 border-primary/20 relative overflow-hidden">
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Submission Successful!</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Your project has been securely uploaded and time-stamped. The evaluation panel will review your submission shortly.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Update Submission
                </button>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                  <div>
                    <h2 className="text-xl font-bold">Streakathon #15: AI & Automation</h2>
                    <p className="text-sm text-muted-foreground">Deadline: Saturday, 8:00 PM</p>
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-xl text-sm font-bold flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                    Accepting Submissions
                  </div>
                </div>

                <form onSubmit={handleSubmission} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">GitHub Repository URL <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Github className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                      <input 
                        required
                        type="url"
                        className="w-full h-12 rounded-xl border border-white/10 bg-background/50 px-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                        placeholder="https://github.com/team-name/project" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Demo Video URL (YouTube / Drive) <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Video className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                      <input 
                        required
                        type="url"
                        className="w-full h-12 rounded-xl border border-white/10 bg-background/50 px-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                        placeholder="https://youtube.com/watch?v=..." 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Project Presentation (PPT/PDF)</label>
                      <div className="relative cursor-pointer group">
                        <input type="file" accept=".ppt,.pptx,.pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="w-full h-12 rounded-xl border border-white/10 bg-background/50 px-4 flex items-center gap-3 group-hover:bg-white/5 transition-colors">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground truncate">Choose file...</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Source Code (ZIP)</label>
                      <div className="relative cursor-pointer group">
                        <input type="file" accept=".zip,.rar" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="w-full h-12 rounded-xl border border-white/10 bg-background/50 px-4 flex items-center gap-3 group-hover:bg-white/5 transition-colors">
                          <FileArchive className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground truncate">Choose file...</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2"><Upload className="w-5 h-5 animate-bounce" /> Uploading...</span>
                      ) : (
                        <span className="flex items-center gap-2"><Upload className="w-5 h-5" /> Submit Project</span>
                      )}
                    </button>
                    <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> You can update your submission until the deadline.
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Submission History */}
        <div>
          <div className="glass-card rounded-3xl p-6 md:p-8 h-full">
            <h3 className="text-xl font-bold mb-6">Submission History</h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-background/50 border border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-sm">Streakathon #14</h4>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Evaluated</span>
                </div>
                <div className="text-xs text-muted-foreground mb-3">Submitted on Sep 28, 2026, 7:45 PM</div>
                <div className="flex gap-2">
                  <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-muted-foreground transition-colors"><Github className="w-4 h-4" /></a>
                  <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-muted-foreground transition-colors"><Video className="w-4 h-4" /></a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-background/50 border border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-sm">Streakathon #13</h4>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Evaluated</span>
                </div>
                <div className="text-xs text-muted-foreground mb-3">Submitted on Aug 15, 2026, 6:30 PM</div>
                <div className="flex gap-2">
                  <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-muted-foreground transition-colors"><Github className="w-4 h-4" /></a>
                  <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-muted-foreground transition-colors"><Video className="w-4 h-4" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
