"use client";

import { useState } from "react";
import { evaluateParticipant } from "@/actions/evaluation";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

export function EvaluationForm({ studentId, hackathonId, studentName }: { studentId: string, hackathonId: string, studentName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scores, setScores] = useState({
    participation: 0,
    presentation: 0,
    technical: 0,
    communication: 0,
    innovation: 0
  });

  const handleScoreChange = (category: keyof typeof scores, value: number) => {
    setScores(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await evaluateParticipant(studentId, hackathonId, scores);
    
    if (!res.success) {
      setError(res.error || "Failed to evaluate participant");
    } else {
      router.push("/dashboard/ambassador");
      router.refresh();
    }
    setLoading(false);
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-card border border-white/10 rounded-xl p-6 shadow-xl w-full max-w-xl mx-auto">
      <h3 className="text-xl font-bold mb-4">Evaluate: {studentName}</h3>
      {error && <div className="mb-4 text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.keys(scores).map((cat) => (
          <div key={cat} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="capitalize font-semibold text-slate-300">{cat}</label>
              <span className="text-emerald-500 font-bold">{scores[cat as keyof typeof scores]}/10</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="10" 
              value={scores[cat as keyof typeof scores]}
              onChange={(e) => handleScoreChange(cat as keyof typeof scores, parseInt(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        ))}

        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
          <div className="text-lg">Total Score: <span className="font-bold text-emerald-500">{totalScore}/50</span></div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Evaluation"}
          </button>
        </div>
      </form>
    </div>
  );
}
